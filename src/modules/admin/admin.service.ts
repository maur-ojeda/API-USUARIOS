import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import * as argon from 'argon2';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
  ) {}

  async getUsers(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['role', 'profile'],
      withDeleted: true,
    });
  }

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'profile', 'addresses', 'userAttribute'],
      withDeleted: true,
    });
  }

  async createUser(data: {
    email: string;
    password: string;
    roleId: number;
    firstName?: string;
    lastName?: string;
  }): Promise<User> {
    const passwordHash = await argon.hash(data.password);

    const user = this.usersRepository.create({
      email: data.email,
      passwordHash,
      roleId: data.roleId,
    });

    return this.usersRepository.save(user);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, data);
    const user = await this.getUser(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await this.usersRepository.softRemove({ id } as User);
  }

  async restoreUser(id: string): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async getRoles(): Promise<Role[]> {
    return this.rolesRepository.find();
  }

  async updateUserRole(userId: string, roleId: number): Promise<User> {
    return this.updateUser(userId, { roleId } as Partial<User>);
  }
}
