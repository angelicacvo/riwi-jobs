import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsService } from './applications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Repository } from 'typeorm';
import { VacanciesService } from '../vacancies/vacancies.service';
import { UserRole } from '../common/enums/roles.enum';
import { NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { ModalityEnum } from '../common/enums/modality.enum';

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
    repository = module.get<Repository<Application>>(getRepositoryToken(Application));
    vacanciesService = module.get<VacanciesService>(VacanciesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new application for a coder', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(2);
      mockRepository.create.mockReturnValue(mockApplication);
      mockRepository.save.mockResolvedValue(mockApplication);

      const result = await service.create({ vacancyId: '1' }, mockCoder as any);

      expect(result).toEqual(mockApplication);
    });

    it('should throw ForbiddenException if user is not a coder', async () => {
      await expect(
        service.create({ vacancyId: '1' }, mockAdmin as any),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw BadRequestException if vacancy is not active', async () => {
      mockVacanciesService.findOne.mockResolvedValue({ ...mockVacancy, isActive: false });

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user already applied to this vacancy', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(mockApplication);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { userId: mockCoder.id, vacancyId: '1' },
      });
    });

    it('should throw BadRequestException if vacancy reached maximum applicants', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(10);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if user has 3 active applications', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.count.mockResolvedValueOnce(5).mockResolvedValueOnce(3);

      await expect(
        service.create({ vacancyId: '1' }, mockCoder as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return only coder applications if user is coder', async () => {
      mockRepository.find.mockResolvedValue([mockApplication]);

      const result = await service.findAll(mockCoder as any);

      expect(result).toEqual([mockApplication]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { userId: mockCoder.id },
        relations: ['vacancy'],
        order: { appliedAt: 'DESC' },
      });
    });

    it('should return all applications if user is admin', async () => {
      mockRepository.find.mockResolvedValue([mockApplication]);

      const result = await service.findAll(mockAdmin as any);

      expect(result).toEqual([mockApplication]);
      expect(mockRepository.find).toHaveBeenCalledWith({
        relations: ['vacancy', 'user'],
        order: { appliedAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return an application', async () => {
      mockRepository.findOne.mockResolvedValue(mockApplication);

      const result = await service.findOne('1', mockCoder as any);

      expect(result).toEqual(mockApplication);
    });

    it('should throw NotFoundException if application not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('999', mockCoder as any)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if coder tries to view another coder application', async () => {
      mockRepository.findOne.mockResolvedValue({ ...mockApplication, userId: '999' });

      await expect(service.findOne('1', mockCoder as any)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('remove', () => {
    it('should remove an application', async () => {
      mockRepository.findOne.mockResolvedValue(mockApplication);
      mockRepository.remove.mockResolvedValue(mockApplication);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalled();
    });

    it('should throw NotFoundException if application not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getVacancyStats', () => {
    it('should return vacancy statistics', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.count.mockResolvedValue(5);

      const result = await service.getVacancyStats('1');

      expect(result).toEqual({
        vacancyId: '1',
        maxApplicants: 10,
        currentApplications: 5,
        availableSlots: 5,
        isFullyBooked: false,
      });
    });

    it('should return isFullyBooked true when vacancy is full', async () => {
      mockVacanciesService.findOne.mockResolvedValue(mockVacancy);
      mockRepository.count.mockResolvedValue(10);

      const result = await service.getVacancyStats('1');

      expect(result.isFullyBooked).toBe(true);
      expect(result.availableSlots).toBe(0);
    });
  });
});
