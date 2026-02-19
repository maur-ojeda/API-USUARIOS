import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from '../../entities/role.entity';

describe('RolesService', () => {
  let service: RolesService;
  let mockRolesRepository: any;

  beforeEach(async () => {
    mockRolesRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRolesRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const roles = [
        { id: 1, name: 'ADMIN' },
        { id: 2, name: 'USER' },
        { id: 3, name: 'EDITOR' },
      ];
      mockRolesRepository.find.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(result).toEqual(roles);
    });
  });

  describe('findById', () => {
    it('should return a role by id', async () => {
      const role = { id: 1, name: 'ADMIN' };
      mockRolesRepository.findOne.mockResolvedValue(role);

      const result = await service.findById(1);

      expect(result).toEqual(role);
    });

    it('should return null if role not found', async () => {
      mockRolesRepository.findOne.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByName', () => {
    it('should return a role by name', async () => {
      const role = { id: 1, name: 'ADMIN' };
      mockRolesRepository.findOne.mockResolvedValue(role);

      const result = await service.findByName('ADMIN');

      expect(result).toEqual(role);
    });

    it('should return null if role not found', async () => {
      mockRolesRepository.findOne.mockResolvedValue(null);

      const result = await service.findByName('NONEXISTENT');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new role', async () => {
      const newRole = {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator',
      };
      const savedRole = { id: 4, ...newRole };
      mockRolesRepository.save.mockResolvedValue(savedRole);

      const result = await service.create(newRole);

      expect(result).toEqual(savedRole);
      expect(mockRolesRepository.save).toHaveBeenCalledWith(newRole);
    });
  });
});
