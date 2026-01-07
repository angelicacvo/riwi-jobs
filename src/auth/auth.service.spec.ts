import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { UserRole } from '../common/enums/roles.enum';

describe('AuthService', () => {
  let service: AuthService;
  let repository: Repository<User>;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: UserRole.CODER,
    createdAt: new Date(),
    comparePassword: jest.fn(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
    })),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('debe registrar un nuevo usuario exitosamente', async () => {
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result).toHaveProperty('user');
      expect(result.message).toBe('User registered successfully');
    });

    it('debe lanzar ConflictException si el email ya existe', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('debe hacer login exitoso con credenciales válidas', async () => {
      const userWithCompare = { ...mockUser };
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(userWithCompare),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      (userWithCompare.comparePassword as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue('jwt-token');

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('access_token');
      expect(result.message).toBe('Login successful');
    });

    it('debe lanzar UnauthorizedException para email inválido', async () => {
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);

      await expect(
        service.login({
          email: 'wrong@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('debe lanzar UnauthorizedException para contraseña inválida', async () => {
      const userWithCompare = { ...mockUser };
      const queryBuilder = {
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(userWithCompare),
      };
      mockRepository.createQueryBuilder.mockReturnValue(queryBuilder);
      (userWithCompare.comparePassword as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
