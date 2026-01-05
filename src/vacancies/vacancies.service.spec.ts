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
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockVacancy]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAll({});

      expect(result).toEqual([mockVacancy]);
    });

    it('should filter vacancies by company', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockVacancy]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ company: 'Tech Corp' });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'vacancy.company ILIKE :company',
        { company: '%Tech Corp%' },
      );
    });

    it('should filter vacancies by modality', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockVacancy]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ modality: ModalityEnum.REMOTE });

      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        'vacancy.modality = :modality',
        { modality: ModalityEnum.REMOTE },
      );
    });

    it('should apply pagination', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockVacancy]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.findAll({ page: 2, limit: 10 });

      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(10);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(10);
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

  describe('findAvailableVacancies', () => {
    it('should return vacancies with available slots', async () => {
      const mockQueryBuilder: any = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockVacancy]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findAvailableVacancies();

      expect(result).toEqual([mockVacancy]);
      expect(mockQueryBuilder.where).toHaveBeenCalledWith(
        'vacancy.isActive = :isActive',
        { isActive: true },
      );
    });
  });
});
