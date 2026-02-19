import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let mockUsersRepository: any;

  beforeEach(async () => {
    mockUsersRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', email: 'user1@example.com' },
        { id: '2', email: 'user2@example.com' },
      ];
      mockUsersRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUsersRepository.find).toHaveBeenCalledWith({
        relations: ['role', 'profile'],
        withDeleted: true,
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'user@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findOne('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'user@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);

      const result = await service.findByEmail('user@example.com');

      expect(result).toEqual(user);
    });

    it('should return null if user not found', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const user = { id: '1', email: 'user@example.com', isActive: true };
      const updateData = { isActive: false };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.save.mockResolvedValue({ ...user, ...updateData });

      const result = await service.findOne('1');
      Object.assign(result, updateData);
      const saved = await mockUsersRepository.save(result);

      expect(saved.isActive).toBe(false);
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const user = { id: '1', email: 'user@example.com' };
      mockUsersRepository.findOne.mockResolvedValue(user);
      mockUsersRepository.softRemove.mockResolvedValue(user);

      await service.remove('1');

      expect(mockUsersRepository.softRemove).toHaveBeenCalledWith(user);
    });
  });
});
