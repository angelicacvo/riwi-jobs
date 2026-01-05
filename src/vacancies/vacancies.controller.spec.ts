import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';
import { ModalityEnum } from '../common/enums/modality.enum';

/**
 * Unit tests for VacanciesController
 * Tests vacancy management endpoints
 */
describe('VacanciesController', () => {
  let controller: VacanciesController;
  let service: VacanciesService;

  // Mock VacanciesService
  const mockVacanciesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAvailableVacancies: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    toggleActive: jest.fn(),
    remove: jest.fn(),
    getVacancyStats: jest.fn(),
    getGeneralStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VacanciesController],
      providers: [
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    controller = module.get<VacanciesController>(VacanciesController);
    service = module.get<VacanciesService>(VacanciesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vacancy', async () => {
      const createVacancyDto = {
        title: 'Developer',
        description: 'Backend developer',
        technologies: 'Node.js',
        seniority: 'Senior',
        location: 'Remote',
        modality: ModalityEnum.REMOTE,
        salaryRange: '$3000-$5000',
        company: 'Tech Corp',
        maxApplicants: 10,
      };

      const expectedVacancy = {
        id: '1',
        ...createVacancyDto,
        isActive: true,
        createdAt: new Date(),
      };

      mockVacanciesService.create.mockResolvedValue(expectedVacancy);

      const result = await controller.create(createVacancyDto);

      expect(result).toEqual(expectedVacancy);
      expect(service.create).toHaveBeenCalledWith(createVacancyDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated vacancies', async () => {
      const queryDto = { page: 1, limit: 10 };
      const expectedResult = {
        data: [{ id: '1', title: 'Developer' }],
        total: 1,
        page: 1,
        limit: 10,
      };

      mockVacanciesService.findAll.mockResolvedValue(expectedResult);

      const result = await controller.findAll(queryDto);

      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith(queryDto);
    });
  });
});
