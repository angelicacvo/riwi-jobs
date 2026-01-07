import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { Application } from './entities/application.entity';
import { User } from '../users/entities/user.entity';
import { Vacancy } from '../vacancies/entities/vacancy.entity';
import { VacanciesModule } from '../vacancies/vacancies.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application, User, Vacancy]),
    VacanciesModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
})
export class ApplicationsModule {}
