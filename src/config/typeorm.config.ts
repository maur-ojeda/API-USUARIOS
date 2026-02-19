import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Profile } from '../entities/profile.entity';
import { Address } from '../entities/address.entity';
import { UserAttribute } from '../entities/user-attribute.entity';
import { AuditLog } from '../entities/audit-log.entity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'api_usuarios',
  password: process.env.DB_PASSWORD || 'kabcyk-sIgke2-tozjes',
  database: process.env.DB_DATABASE || 'db_api_usuarios',
  schema: process.env.DB_SCHEMA || 'db_api_usuarios',
  entities: [User, Role, Profile, Address, UserAttribute, AuditLog],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
};
