import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from '../common/enums/roles.enum';
import { NotFoundException, ConflictException, ForbiddenException, BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.CODER,
    createdAt: new Date(),
    applications: [],
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockAdmin: User = {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'hashedPassword',
    role: UserRole.ADMIN,
    createdAt: new Date(),
    applications: [],
    comparePassword: jest.fn(),
    hashPassword: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: UserRole.CODER,
      });

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          role: UserRole.CODER,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, name: 'Updated' });

      const result = await service.update('1', { name: 'Updated' }, mockAdmin);

      expect(result.name).toBe('Updated');
    });

    it('should throw ForbiddenException if user tries to change own role', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.update('1', { role: UserRole.ADMIN }, mockUser),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw ForbiddenException if non-admin tries to change password of another user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.update('1', { password: 'newpass' }, mockAdmin),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove('1', mockAdmin);

      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user tries to delete own account', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.remove('1', mockUser)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if deleting last admin', async () => {
      mockRepository.findOne.mockResolvedValue(mockAdmin);
      mockRepository.count.mockResolvedValue(1);

      const anotherAdmin = { ...mockAdmin, id: '3', hashPassword: jest.fn(), comparePassword: jest.fn() };
      await expect(service.remove('2', anotherAdmin as any)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUsersStats', () => {
    it('should return users statistics', async () => {
      mockRepository.count.mockResolvedValue(25);

      const mockQueryBuilder: any = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([
          { role: UserRole.ADMIN, count: '2' },
          { role: UserRole.GESTOR, count: '5' },
          { role: UserRole.CODER, count: '18' },
        ]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.getUsersStats();

      expect(result.totalUsers).toBe(25);
      expect(result.usersByRole).toEqual({
        [UserRole.ADMIN]: 2,
        [UserRole.GESTOR]: 5,
        [UserRole.CODER]: 18,
      });
      expect(result.recentUsers).toEqual([mockUser]);
    });
  });
});
