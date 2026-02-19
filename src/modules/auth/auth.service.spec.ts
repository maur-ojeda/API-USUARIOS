import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { Role } from '../../entities/role.entity';
import { UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';

describe('AuthService', () => {
  let service: AuthService;
  let mockUsersRepository: any;
  let mockRolesRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUsersRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      manager: {
        create: jest.fn().mockImplementation((entity, data) => data),
        save: jest.fn().mockResolvedValue({ id: 'uuid' }),
      },
    };

    mockRolesRepository = {
      findOne: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mock-jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
        {
          provide: getRepositoryToken(Role),
          useValue: mockRolesRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should throw UnauthorizedException if email already exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue({ id: 'existing-user' });

      await expect(
        service.register({
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should create a new user successfully', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      mockRolesRepository.findOne.mockResolvedValue({ id: 2, name: 'USER' });
      mockUsersRepository.create.mockReturnValue({
        email: 'test@example.com',
        passwordHash: 'hashed-password',
        roleId: 2,
      });
      mockUsersRepository.save.mockResolvedValue({
        id: 'new-user-id',
        email: 'test@example.com',
        roleId: 2,
      });

      const result = await service.register({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('token');
      expect(result.user).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(
        service.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockUsersRepository.findOne.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hashed-password',
      });

      (argon.verify as jest.Mock) = jest.fn().mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
