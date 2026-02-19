import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../../entities/profile.entity';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private profilesRepository: Repository<Profile>,
  ) {}

  async findByUserId(userId: string): Promise<Profile> {
    const profile = await this.profilesRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(`Profile for user ${userId} not found`);
    }

    return profile;
  }

  async update(userId: string, updateData: Partial<Profile>): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    Object.assign(profile, updateData);
    return this.profilesRepository.save(profile);
  }
}
