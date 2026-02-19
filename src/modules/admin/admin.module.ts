import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Profile } from '../../entities/profile.entity';
import { Address } from '../../entities/address.entity';
import { UserAttribute } from '../../entities/user-attribute.entity';
import { AuditLog } from '../../entities/audit-log.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      Profile,
      Address,
      UserAttribute,
      AuditLog,
    ]),
    RolesModule,
  ],
  providers: [AdminService],
  controllers: [AdminController],
  exports: [AdminService],
})
export class AdminModule {}
