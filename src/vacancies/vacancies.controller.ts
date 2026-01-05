import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/roles.enum';

@Controller('vacancies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async create(@Body() createVacancyDto: CreateVacancyDto) {
    return await this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  @Public()
  async findAll() {
    return await this.vacanciesService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return await this.vacanciesService.update(id, updateVacancyDto);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async toggleActive(@Param('id') id: string) {
    return await this.vacanciesService.toggleActive(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.vacanciesService.remove(id);
    return { message: 'Vacancy deleted successfully' };
  }

  @Get('stats/:id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getVacancyStats(@Param('id') id: string) {
    return await this.vacanciesService.getVacancyStats(id);
  }

  @Get('stats/general/overview')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getGeneralStats() {
    return await this.vacanciesService.getGeneralStats();
  }
}
