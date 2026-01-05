import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { Vacancy } from './entities/vacancy.entity';

@Injectable()
export class VacanciesService {
  constructor(
    @InjectRepository(Vacancy)
    private vacanciesRepository: Repository<Vacancy>,
  ) {}

  async create(createVacancyDto: CreateVacancyDto): Promise<Vacancy> {
    if (createVacancyDto.maxApplicants < 1) {
      throw new BadRequestException('maxApplicants must be at least 1');
    }

    const vacancy = this.vacanciesRepository.create(createVacancyDto);
    return await this.vacanciesRepository.save(vacancy);
  }

  async findAll(): Promise<Vacancy[]> {
    return await this.vacanciesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Vacancy> {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id },
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${id} not found`);
    }

    return vacancy;
  }

  async update(id: string, updateVacancyDto: UpdateVacancyDto): Promise<Vacancy> {
    const vacancy = await this.findOne(id);

    if (updateVacancyDto.maxApplicants !== undefined && updateVacancyDto.maxApplicants < 1) {
      throw new BadRequestException('maxApplicants must be at least 1');
    }

    Object.assign(vacancy, updateVacancyDto);
    return await this.vacanciesRepository.save(vacancy);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id },
      relations: ['applications'],
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${id} not found`);
    }

    if (vacancy.applications && vacancy.applications.length > 0) {
      throw new BadRequestException(
        'Cannot delete vacancy with existing applications',
      );
    }

    await this.vacanciesRepository.remove(vacancy);
  }

  async toggleActive(id: string): Promise<Vacancy> {
    const vacancy = await this.findOne(id);
    vacancy.isActive = !vacancy.isActive;
    return await this.vacanciesRepository.save(vacancy);
  }

  async getVacancyStats(vacancyId: string) {
    const vacancy = await this.vacanciesRepository.findOne({
      where: { id: vacancyId },
      relations: ['applications'],
    });

    if (!vacancy) {
      throw new NotFoundException(`Vacancy with ID ${vacancyId} not found`);
    }

    const currentApplications = vacancy.applications?.length || 0;
    const availableSlots = vacancy.maxApplicants - currentApplications;

    return {
      vacancyId,
      title: vacancy.title,
      company: vacancy.company,
      maxApplicants: vacancy.maxApplicants,
      currentApplications,
      availableSlots: availableSlots > 0 ? availableSlots : 0,
      isFullyBooked: currentApplications >= vacancy.maxApplicants,
      isActive: vacancy.isActive,
    };
  }

  async getGeneralStats() {
    const totalVacancies = await this.vacanciesRepository.count();
    const activeVacancies = await this.vacanciesRepository.count({
      where: { isActive: true },
    });

    const vacanciesWithSlots = await this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .where('vacancy.isActive = :isActive', { isActive: true })
      .andWhere(
        '(SELECT COUNT(*) FROM application WHERE application.vacancyId = vacancy.id) < vacancy.maxApplicants',
      )
      .getCount();

    const mostRecentVacancies = await this.vacanciesRepository.find({
      order: { createdAt: 'DESC' },
      take: 5,
    });

    return {
      totalVacancies,
      activeVacancies,
      inactiveVacancies: totalVacancies - activeVacancies,
      vacanciesWithAvailableSlots: vacanciesWithSlots,
      mostRecentVacancies,
    };
  }
}
