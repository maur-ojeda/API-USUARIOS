import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAttribute } from '../../entities/user-attribute.entity';

@Injectable()
export class UserAttributesService {
  constructor(
    @InjectRepository(UserAttribute)
    private userAttributesRepository: Repository<UserAttribute>,
  ) {}

  async findByUserId(userId: string): Promise<UserAttribute> {
    const attribute = await this.userAttributesRepository.findOne({
      where: { userId },
    });

    if (!attribute) {
      throw new NotFoundException(
        `User attributes for user ${userId} not found`,
      );
    }

    return attribute;
  }

  async update(
    userId: string,
    updateData: Partial<UserAttribute>,
  ): Promise<UserAttribute> {
    const attribute = await this.findByUserId(userId);
    Object.assign(attribute, updateData);
    return this.userAttributesRepository.save(attribute);
  }

  async updateCustomData(
    userId: string,
    customData: Record<string, any>,
  ): Promise<UserAttribute> {
    const attribute = await this.findByUserId(userId);
    attribute.customData = customData;
    return this.userAttributesRepository.save(attribute);
  }

  async updatePreferences(
    userId: string,
    preferences: Record<string, any>,
  ): Promise<UserAttribute> {
    const attribute = await this.findByUserId(userId);
    attribute.preferences = preferences;
    return this.userAttributesRepository.save(attribute);
  }
}
