import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { QueryVacancyDto } from './dto/query-vacancy.dto';
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

  async findAll(queryDto?: QueryVacancyDto): Promise<Vacancy[]> {
    const {
      company,
      location,
      modality,
      isActive,
      hasAvailableSlots,
      order = 'DESC',
      orderBy = 'createdAt',
      page,
      limit,
    } = queryDto || {};

    const queryBuilder = this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .leftJoinAndSelect('vacancy.applications', 'application');

    if (company) {
      queryBuilder.andWhere('vacancy.company ILIKE :company', {
        company: `%${company}%`,
      });
    }

    if (location) {
      queryBuilder.andWhere('vacancy.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    if (modality) {
      queryBuilder.andWhere('vacancy.modality = :modality', { modality });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('vacancy.isActive = :isActive', { isActive });
    }

    if (hasAvailableSlots) {
      queryBuilder.andWhere(
        '(SELECT COUNT(*) FROM application WHERE application.vacancyId = vacancy.id) < vacancy.maxApplicants',
      );
    }

    queryBuilder.orderBy(`vacancy.${orderBy}`, order);

    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    return await queryBuilder.getMany();
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

  async findAvailableVacancies(): Promise<Vacancy[]> {
    return await this.vacanciesRepository
      .createQueryBuilder('vacancy')
      .leftJoinAndSelect('vacancy.applications', 'application')
      .where('vacancy.isActive = :isActive', { isActive: true })
      .andWhere(
        '(SELECT COUNT(*) FROM application WHERE application.vacancyId = vacancy.id) < vacancy.maxApplicants',
      )
      .orderBy('vacancy.createdAt', 'DESC')
      .getMany();
  }
}
