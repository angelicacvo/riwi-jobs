import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('debe registrar un usuario', async () => {
      const registerDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { access_token: 'token', user: {}, message: 'Success' };
      mockAuthService.register.mockResolvedValue(result);

      expect(await controller.register(registerDto)).toEqual(result);
      expect(service.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('debe hacer login de un usuario', async () => {
      const loginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const result = { access_token: 'token', user: {}, message: 'Success' };
      mockAuthService.login.mockResolvedValue(result);

      expect(await controller.login(loginDto)).toEqual(result);
      expect(service.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
