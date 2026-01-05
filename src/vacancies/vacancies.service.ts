import { Injectable, NotFoundException } from '@nestjs/common';
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
    Object.assign(vacancy, updateVacancyDto);
    return await this.vacanciesRepository.save(vacancy);
  }

  async remove(id: string): Promise<void> {
    const vacancy = await this.findOne(id);
    await this.vacanciesRepository.remove(vacancy);
  }
}
