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
}
