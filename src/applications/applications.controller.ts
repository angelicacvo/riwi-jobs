import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../common/enums/roles.enum';

@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.CODER)
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.applicationsService.create(createApplicationDto, currentUser);
  }

  @Get()
  async findAll(@CurrentUser() currentUser: User) {
    return await this.applicationsService.findAll(currentUser);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return await this.applicationsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return await this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    await this.applicationsService.remove(id);
    return { message: 'Application deleted successfully' };
  }

  @Get('vacancy/:vacancyId/stats')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getVacancyStats(@Param('vacancyId') vacancyId: string) {
    return await this.applicationsService.getVacancyStats(vacancyId);
  }

  @Get('stats/user/:userId')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getUserStats(@Param('userId') userId: string) {
    return await this.applicationsService.getUserStats(userId);
  }

  @Get('stats/vacancy/:vacancyId')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getVacancyApplicationsCount(@Param('vacancyId') vacancyId: string) {
    const count = await this.applicationsService.getVacancyApplicationsCount(vacancyId);
    return { vacancyId, applicationsCount: count };
  }

  @Get('stats/popular/vacancies')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getMostPopularVacancies() {
    return await this.applicationsService.getMostPopularVacancies(10);
  }

  @Get('stats/dashboard')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  async getDashboardStats() {
    return await this.applicationsService.getDashboardStats();
  }
}
