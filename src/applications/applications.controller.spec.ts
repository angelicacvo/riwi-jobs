import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';

describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  const mockApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'CODER',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationsService,
        },
      ],
    }).compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
    service = module.get<ApplicationsService>(ApplicationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una postulación', async () => {
      const createDto = { vacancyId: '1' };
      const result = { id: '1', vacancyId: '1', userId: '1' };
      mockApplicationsService.create.mockResolvedValue(result);

      expect(await controller.create(createDto, mockUser as any)).toEqual(
        result,
      );
      expect(service.create).toHaveBeenCalledWith(createDto, mockUser);
    });
  });
});
