import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserAttribute } from '../../entities/user-attribute.entity';
import { UserAttributesService } from './user-attributes.service';
import { UserAttributesController } from './user-attributes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserAttribute])],
  providers: [UserAttributesService],
  controllers: [UserAttributesController],
  exports: [UserAttributesService],
})
export class UserAttributesModule {}
