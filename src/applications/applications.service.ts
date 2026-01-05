import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Application } from './entities/application.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/roles.enum';
import { VacanciesService } from '../vacancies/vacancies.service';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
    private vacanciesService: VacanciesService,
  ) {}

  async create(createApplicationDto: CreateApplicationDto, currentUser: User): Promise<Application> {
    if (currentUser.role !== UserRole.CODER) {
      throw new ForbiddenException('Only coders can apply to vacancies');
    }

    const vacancy = await this.vacanciesService.findOne(createApplicationDto.vacancyId);

    if (!vacancy.isActive) {
      throw new BadRequestException('This vacancy is not active');
    }

    const existingApplication = await this.applicationsRepository.findOne({
      where: {
        userId: currentUser.id,
        vacancyId: createApplicationDto.vacancyId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You have already applied to this vacancy');
    }

    const currentApplications = await this.applicationsRepository.count({
      where: { vacancyId: createApplicationDto.vacancyId },
    });

    if (currentApplications >= vacancy.maxApplicants) {
      throw new BadRequestException('This vacancy has reached its maximum number of applicants');
    }

    const userActiveApplications = await this.applicationsRepository.count({
      where: { userId: currentUser.id },
    });

    if (userActiveApplications >= 3) {
      throw new BadRequestException('You cannot have more than 3 active applications');
    }

    const application = this.applicationsRepository.create({
      userId: currentUser.id,
      vacancyId: createApplicationDto.vacancyId,
    });

    return await this.applicationsRepository.save(application);
  }

  async findAll(currentUser: User): Promise<Application[]> {
    if (currentUser.role === UserRole.CODER) {
      return await this.applicationsRepository.find({
        where: { userId: currentUser.id },
        relations: ['vacancy'],
        order: { appliedAt: 'DESC' },
      });
    }

    return await this.applicationsRepository.find({
      relations: ['vacancy', 'user'],
      order: { appliedAt: 'DESC' },
    });
  }

  async findOne(id: string, currentUser: User): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
      relations: ['vacancy', 'user'],
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    if (currentUser.role === UserRole.CODER && application.userId !== currentUser.id) {
      throw new ForbiddenException('You can only view your own applications');
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    Object.assign(application, updateApplicationDto);
    return await this.applicationsRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Application with ID ${id} not found`);
    }

    await this.applicationsRepository.remove(application);
  }

  async getVacancyStats(vacancyId: string) {
    const vacancy = await this.vacanciesService.findOne(vacancyId);

    const currentApplications = await this.applicationsRepository.count({
      where: { vacancyId },
    });

    return {
      vacancyId,
      maxApplicants: vacancy.maxApplicants,
      currentApplications,
      availableSlots: vacancy.maxApplicants - currentApplications,
      isFullyBooked: currentApplications >= vacancy.maxApplicants,
    };
  }

  async getUserStats(userId: string) {
    const totalApplications = await this.applicationsRepository.count({
      where: { userId },
    });

    const applications = await this.applicationsRepository.find({
      where: { userId },
      relations: ['vacancy'],
      order: { appliedAt: 'DESC' },
    });

    return {
      userId,
      totalApplications,
      activeApplications: totalApplications,
      recentApplications: applications.slice(0, 5),
    };
  }

  async getVacancyApplicationsCount(vacancyId: string): Promise<number> {
    return await this.applicationsRepository.count({
      where: { vacancyId },
    });
  }

  async getMostPopularVacancies(limit: number = 10) {
    const result = await this.applicationsRepository
      .createQueryBuilder('application')
      .select('application.vacancyId', 'vacancyId')
      .addSelect('COUNT(application.id)', 'applicationsCount')
      .leftJoin('application.vacancy', 'vacancy')
      .addSelect('vacancy.title', 'title')
      .addSelect('vacancy.company', 'company')
      .groupBy('application.vacancyId')
      .addGroupBy('vacancy.title')
      .addGroupBy('vacancy.company')
      .orderBy('applicationsCount', 'DESC')
      .limit(limit)
      .getRawMany();

    return result.map((item) => ({
      vacancyId: item.vacancyId,
      title: item.title,
      company: item.company,
      applicationsCount: parseInt(item.applicationsCount),
    }));
  }

  async getDashboardStats() {
    const totalApplications = await this.applicationsRepository.count();

    const applicationsByVacancy = await this.applicationsRepository
      .createQueryBuilder('application')
      .select('COUNT(DISTINCT application.vacancyId)', 'vacanciesWithApplications')
      .getRawOne();

    const applicationsByUser = await this.applicationsRepository
      .createQueryBuilder('application')
      .select('COUNT(DISTINCT application.userId)', 'usersWithApplications')
      .getRawOne();

    const recentApplications = await this.applicationsRepository.find({
      relations: ['user', 'vacancy'],
      order: { appliedAt: 'DESC' },
      take: 10,
    });

    const mostPopular = await this.getMostPopularVacancies(5);

    return {
      totalApplications,
      vacanciesWithApplications: parseInt(applicationsByVacancy.vacanciesWithApplications),
      usersWithApplications: parseInt(applicationsByUser.usersWithApplications),
      recentApplications,
      mostPopularVacancies: mostPopular,
    };
  }
}
