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

  // Crear nueva postulación a una vacante
  async create(createApplicationDto: CreateApplicationDto, currentUser: User): Promise<Application> {
    if (currentUser.role !== UserRole.CODER) {
      throw new ForbiddenException('Solo los coders pueden postularse a vacantes');
    }

    const vacancy = await this.vacanciesService.findOne(createApplicationDto.vacancyId);

    if (!vacancy.isActive) {
      throw new BadRequestException('Esta vacante no está activa');
    }

    const existingApplication = await this.applicationsRepository.findOne({
      where: {
        userId: currentUser.id,
        vacancyId: createApplicationDto.vacancyId,
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Ya te postulaste a esta vacante');
    }

    const currentApplications = await this.applicationsRepository.count({
      where: { vacancyId: createApplicationDto.vacancyId },
    });

    if (currentApplications >= vacancy.maxApplicants) {
      throw new BadRequestException('Esta vacante alcanzó el máximo de postulantes');
    }

    const application = this.applicationsRepository.create({
      userId: currentUser.id,
      vacancyId: createApplicationDto.vacancyId,
    });

    return await this.applicationsRepository.save(application);
  }

  // Obtener postulaciones (filtradas por rol)
  async findAll(currentUser: User): Promise<Application[]> {
    // CODER can only see their own applications
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
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
    }

    if (currentUser.role === UserRole.CODER && application.userId !== currentUser.id) {
      throw new ForbiddenException('Solo puedes ver tus propias postulaciones');
    }

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto): Promise<Application> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
    }

    Object.assign(application, updateApplicationDto);
    return await this.applicationsRepository.save(application);
  }

  async remove(id: string): Promise<void> {
    const application = await this.applicationsRepository.findOne({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Postulación con ID ${id} no encontrada`);
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
      .orderBy('"applicationsCount"', 'DESC')
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
