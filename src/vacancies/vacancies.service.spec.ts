import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { ModalityEnum } from '../common/enums/modality.enum';

describe('VacanciesService', () => {
  let service: VacanciesService;
  let repository: Repository<Vacancy>;

  const mockVacancy: Vacancy = {
    id: '1',
    title: 'Backend Developer',
    description: 'Looking for a backend developer',
    technologies: 'Node.js, NestJS',
    seniority: 'Senior',
    softSkills: 'Communication',
    location: 'Remote',
    modality: ModalityEnum.REMOTE,
    salaryRange: '3000-5000 USD',
    company: 'Tech Corp',
    maxApplicants: 10,
    isActive: true,
    createdAt: new Date(),
    applications: [],
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VacanciesService,
        {
          provide: getRepositoryToken(Vacancy),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<VacanciesService>(VacanciesService);
    repository = module.get<Repository<Vacancy>>(getRepositoryToken(Vacancy));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('debe crear una nueva vacante', async () => {
      mockRepository.create.mockReturnValue(mockVacancy);
      mockRepository.save.mockResolvedValue(mockVacancy);

      const result = await service.create({
        title: 'Backend Developer',
        description: 'Looking for a backend developer',
        technologies: 'Node.js, NestJS',
        seniority: 'Senior',
        location: 'Remote',
        modality: ModalityEnum.REMOTE,
        salaryRange: '3000-5000 USD',
        company: 'Tech Corp',
        maxApplicants: 10,
      });

      expect(result).toEqual(mockVacancy);
      expect(mockRepository.create).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si maxApplicants es menor que 1', async () => {
      await expect(
        service.create({
          title: 'Backend Developer',
          description: 'Looking for a backend developer',
          technologies: 'Node.js, NestJS',
          seniority: 'Senior',
          location: 'Remote',
          modality: ModalityEnum.REMOTE,
          salaryRange: '3000-5000 USD',
          company: 'Tech Corp',
          maxApplicants: 0,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
