import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditLogsService } from '../../modules/audit-logs/audit-logs.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(
    @Inject(forwardRef(() => AuditLogsService))
    private auditLogsService: AuditLogsService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method as string;
    const path = (request.route?.path || request.url) as string;
    const user = request.user;

    if (!['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const action = this.getAction(method, path);

    return next.handle().pipe(
      tap({
        next: () => {
          if (user && action) {
            const targetUserId = this.extractTargetUserId(request);
            const userId = user.userId as string;
            const details = {
              method,
              path,
              body: this.sanitizeBody(request.body),
            };
            void this.auditLogsService.create(
              userId,
              action,
              targetUserId,
              details,
            );
          }
        },
        error: (error: any) => {
          if (user && action) {
            const userId = user.userId as string;
            const details = {
              method,
              path,
              error: error.message,
            };
            void this.auditLogsService.create(
              userId,
              action + '_FAILED',
              undefined,
              details,
            );
          }
        },
      }),
    );
  }

  private getAction(method: string, path: string): string | null {
    if (path.includes('/users') && method === 'POST') return 'CREATE_USER';
    if (path.includes('/users') && method === 'DELETE') return 'DELETE_USER';
    if (path.includes('/users') && (method === 'PATCH' || method === 'PUT'))
      return 'UPDATE_USER';
    if (path.includes('/roles')) return 'CHANGE_ROLE';
    return `MUTATION_${method}`;
  }

  private extractTargetUserId(request: any): string | undefined {
    const params = request.params;
    const body = request.body;
    if (params?.id) {
      return params.id;
    }
    if (body?.userId) {
      return body.userId;
    }
    return undefined;
  }

  private sanitizeBody(body: any): Record<string, any> {
    if (!body) return {};
    const sanitized: Record<string, any> = { ...body };
    delete sanitized.password;
    delete sanitized.passwordHash;
    return sanitized;
  }
}
