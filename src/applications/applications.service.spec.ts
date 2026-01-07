import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UserRole } from '../common/enums/roles.enum';
import { ForbiddenException, BadRequestException } from '@nestjs/common';

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;
  let vacanciesService: VacanciesService;

  const mockCoder = {
    id: '1',
    name: 'Test Coder',
    email: 'coder@example.com',
    role: UserRole.CODER,
  };

  const mockAdmin = {
    id: '2',
    name: 'Test Admin',
    email: 'admin@example.com',
    role: UserRole.ADMIN,
  };

  const mockVacancy = {
    id: '1',
    title: 'Backend Developer',
    isActive: true,
    maxApplicants: 10,
    applications: [],
  };

  const mockApplication = {
    id: '1',
    userId: '1',
    vacancyId: '1',
    appliedAt: new Date(),
    user: mockCoder,
    vacancy: mockVacancy,
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
  };

  const mockVacanciesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockRepository,
        },
        {
          provide: VacanciesService,
          useValue: mockVacanciesService,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
    vacanciesService = module.get<VacanciesService>(VacanciesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una nueva postulacion para un coder', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);
      mockRepository.create.mockReturnValue(mockApplication);
      mockRepository.save.mockResolvedValue(mockApplication);

      const result = await service.create({ vacancyId: '1' }, mockCoder as any);

      expect(result).toEqual(mockApplication);
      expect(mockVacanciesService.findOne).toHaveBeenCalledWith('1');
    });

    it('debe lanzar ForbiddenException si el usuario no es coder', async () => {
      await expect(
        service.create({ vacancyId: '1' }, mockAdmin as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('debe lanzar BadRequestException si la vacante no esta activa', async () => {
      mockVacanciesService.findOne.mockResolvedValue({
        ...mockVacancy,
        isActive: false,
      });

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si el usuario ya aplico a esta vacante', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(mockApplication);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si la vacante alcanzo el maximo de postulantes', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(10);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('debe lanzar BadRequestException si el usuario tiene 3 postulaciones activas', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
