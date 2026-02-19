import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogsRepository: Repository<AuditLog>,
  ) {}

  async create(
    adminId: string,
    action: string,
    targetUserId?: string,
    details?: Record<string, any>,
  ): Promise<AuditLog> {
    const auditLog = this.auditLogsRepository.create({
      adminId,
      action,
      targetUserId,
      details,
    });
    return this.auditLogsRepository.save(auditLog);
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByTargetUser(targetUserId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: { targetUserId },
      relations: ['admin'],
      order: { createdAt: 'DESC' },
    });
  }
}
