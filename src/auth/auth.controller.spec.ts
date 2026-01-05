import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

/**
 * Unit tests for AuthController
 * Tests registration and login endpoints
 */
describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  // Mock AuthService
  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Test123!',
      };

      const expectedResult = {
        message: 'User registered successfully',
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'coder' },
        access_token: 'jwt-token',
      };

      mockAuthService.register.mockResolvedValue(expectedResult);

      const result = await controller.register(registerDto);

      expect(result).toEqual(expectedResult);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user and return token', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'Test123!',
      };

      const expectedResult = {
        message: 'Login successful',
        user: { id: '1', name: 'Test User', email: 'test@example.com', role: 'coder' },
        access_token: 'jwt-token',
      };

      mockAuthService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
