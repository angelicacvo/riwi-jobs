import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { UserRole } from '../common/enums/roles.enum';

/**
 * Unit tests for ApplicationsController
 * Tests job application endpoints
 */
describe('ApplicationsController', () => {
  let controller: ApplicationsController;
  let service: ApplicationsService;

  // Mock ApplicationsService
  const mockApplicationsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getVacancyStats: jest.fn(),
    getUserStats: jest.fn(),
    getVacancyApplicationsCount: jest.fn(),
    getMostPopularVacancies: jest.fn(),
    getDashboardStats: jest.fn(),
  };

  // Mock user for testing
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    role: UserRole.CODER,
    password: 'hashed',
    createdAt: new Date(),
    applications: [],
    hashPassword: jest.fn(),
    comparePassword: jest.fn(),
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new application', async () => {
      const createApplicationDto = {
        vacancyId: 'vacancy-1',
      };

      const expectedApplication = {
        id: '1',
        userId: mockUser.id,
        vacancyId: createApplicationDto.vacancyId,
        status: 'pending',
        appliedAt: new Date(),
      };

      mockApplicationsService.create.mockResolvedValue(expectedApplication);

      const result = await controller.create(createApplicationDto, mockUser);

      expect(result).toEqual(expectedApplication);
      expect(service.create).toHaveBeenCalledWith(createApplicationDto, mockUser);
    });
  });

  describe('findAll', () => {
    it('should return user applications', async () => {
      const expectedApplications = [
        { id: '1', vacancyId: 'vacancy-1', status: 'pending' },
      ];

      mockApplicationsService.findAll.mockResolvedValue(expectedApplications);

      const result = await controller.findAll(mockUser);

      expect(result).toEqual(expectedApplications);
      expect(service.findAll).toHaveBeenCalledWith(mockUser);
    });
  });
});
