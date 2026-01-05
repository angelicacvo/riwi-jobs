import { Test, TestingModule } from '@nestjs/testing';
import { VacanciesService } from './vacancies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vacancy } from './entities/vacancy.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
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
    count: jest.fn(),
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new vacancy', async () => {
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
    });

    it('should throw BadRequestException if maxApplicants is less than 1', async () => {
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

  describe('findAll', () => {
    it('should return an array of vacancies', async () => {
      mockRepository.find.mockResolvedValue([mockVacancy]);

      const result = await service.findAll();

      expect(result).toEqual([mockVacancy]);
    });
  });

  describe('findOne', () => {
    it('should return a vacancy by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockVacancy);

      const result = await service.findOne('1');

      expect(result).toEqual(mockVacancy);
    });

    it('should throw NotFoundException if vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a vacancy', async () => {
      mockRepository.findOne.mockResolvedValue(mockVacancy);
      mockRepository.save.mockResolvedValue({ ...mockVacancy, title: 'Updated' });

      const result = await service.update('1', { title: 'Updated' });

      expect(result.title).toBe('Updated');
    });

    it('should throw BadRequestException if maxApplicants is less than 1', async () => {
      mockRepository.findOne.mockResolvedValue(mockVacancy);

      await expect(service.update('1', { maxApplicants: 0 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('remove', () => {
    it('should remove a vacancy without applications', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockVacancy, applications: [] });
      mockRepository.remove.mockResolvedValue(mockVacancy);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should throw BadRequestException if vacancy has applications', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockVacancy, applications: [{ id: '1' }] });

      await expect(service.remove('1')).rejects.toThrow(BadRequestException);
    });
  });

  describe('toggleActive', () => {
    it('should toggle vacancy active status', async () => {
      mockRepository.findOne.mockResolvedValue(mockVacancy);
      mockRepository.save.mockResolvedValue({ ...mockVacancy, isActive: false });

      const result = await service.toggleActive('1');

      expect(result.isActive).toBe(false);
    });
  });

  describe('getVacancyStats', () => {
    it('should return vacancy statistics', async () => {
      const freshVacancy = {
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
        applications: [{ id: '1' }, { id: '2' }],
      };
      mockRepository.findOne.mockResolvedValue(freshVacancy);

      const result = await service.getVacancyStats('1');

      expect(result).toEqual({
        vacancyId: '1',
        title: 'Backend Developer',
        company: 'Tech Corp',
        maxApplicants: 10,
        currentApplications: 2,
        availableSlots: 8,
        isFullyBooked: false,
        isActive: true,
      });
    });

    it('should return isFullyBooked true when vacancy is full', async () => {
      const applications = Array(10).fill({ id: '1' });
      const fullVacancy = { ...mockVacancy, applications, isActive: true };
      mockRepository.findOne.mockResolvedValue(fullVacancy);

      const result = await service.getVacancyStats('1');

      expect(result.isFullyBooked).toBe(true);
      expect(result.availableSlots).toBe(0);
    });

    it('should throw NotFoundException if vacancy not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getVacancyStats('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getGeneralStats', () => {
    it('should return general statistics', async () => {
      mockRepository.count
        .mockResolvedValueOnce(15)
        .mockResolvedValueOnce(10);

      const mockQueryBuilder: any = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(5),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockRepository.find.mockResolvedValue([mockVacancy]);

      const result = await service.getGeneralStats();

      expect(result).toEqual({
        totalVacancies: 15,
        activeVacancies: 10,
        inactiveVacancies: 5,
        vacanciesWithAvailableSlots: 5,
        mostRecentVacancies: [mockVacancy],
      });
    });
  });
});
