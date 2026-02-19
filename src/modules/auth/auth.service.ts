import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { Profile } from '../../entities/profile.entity';
import { UserAttribute } from '../../entities/user-attribute.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Role)
    private rolesRepository: Repository<Role>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const defaultRole = await this.rolesRepository.findOne({
      where: { name: 'USER' },
    });

    const passwordHash = await argon.hash(registerDto.password);

    const user = this.usersRepository.create({
      email: registerDto.email,
      passwordHash,
      roleId: defaultRole?.id || 2,
    });

    const savedUser = await this.usersRepository.save(user);

    const profile = this.usersRepository.manager.create(Profile, {
      userId: savedUser.id,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
    });
    await this.usersRepository.manager.save(profile);

    const userAttribute = this.usersRepository.manager.create(UserAttribute, {
      userId: savedUser.id,
    });
    await this.usersRepository.manager.save(userAttribute);

    const token = this.generateToken(savedUser);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        roleId: savedUser.roleId,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await argon.verify(
      user.passwordHash,
      loginDto.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
      },
      token,
    };
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, email: user.email, roleId: user.roleId };
    return this.jwtService.sign(payload);
  }

  async validateUser(userId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }
}
