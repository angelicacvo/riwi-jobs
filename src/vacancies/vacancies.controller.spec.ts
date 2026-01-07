import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesController } from './vacancies.controller';
import { VacanciesService } from './vacancies.service';

describe('VacanciesController', () => {
  let controller: VacanciesController;
  let service: VacanciesService;

  const mockVacanciesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar todas las vacantes', async () => {
      const result = [{ id: '1', title: 'Backend Developer' }];
      mockVacanciesService.findAll.mockResolvedValue(result);

      expect(await controller.findAll({})).toEqual(result);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
