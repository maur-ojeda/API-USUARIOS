import { Controller, Get, Param } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('audit-logs')
@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audit logs' })
  @ApiResponse({ status: 200, description: 'Returns all audit logs' })
  async findAll() {
    return this.auditLogsService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get audit logs for a specific user' })
  @ApiResponse({ status: 200, description: 'Returns audit logs for user' })
  async findByUser(@Param('userId') userId: string) {
    return this.auditLogsService.findByTargetUser(userId);
  }
}
