import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { AddressesModule } from './modules/addresses/addresses.module';
import { UserAttributesModule } from './modules/user-attributes/user-attributes.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { AdminModule } from './modules/admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { Profile } from './entities/profile.entity';
import { Address } from './entities/address.entity';
import { UserAttribute } from './entities/user-attribute.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST') || 'localhost',
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USERNAME') || 'api_usuarios',
        password:
          configService.get<string>('DB_PASSWORD') || 'kabcyk-sIgke2-tozjes',
        database: configService.get<string>('DB_DATABASE') || 'db_api_usuarios',
        schema: configService.get<string>('DB_SCHEMA') || 'db_api_usuarios',
        entities: [User, Role, Profile, Address, UserAttribute, AuditLog],
        synchronize: true,
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    AuthModule,
    ProfilesModule,
    AddressesModule,
    UserAttributesModule,
    AuditLogsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
