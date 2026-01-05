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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';

@ApiTags('Applications')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-api-key')
@Controller('applications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @Roles(UserRole.CODER)
  @ApiOperation({ summary: 'Crear nueva aplicación a vacante (Solo CODER)' })
  @ApiResponse({ status: 201, description: 'Aplicación creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o reglas de negocio violadas' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya aplicaste a esta vacante o no hay cupos disponibles' })
  async create(
    @Body() createApplicationDto: CreateApplicationDto,
    @CurrentUser() currentUser: User,
  ) {
    return await this.applicationsService.create(createApplicationDto, currentUser);
  }

  @Get()
  @ApiOperation({ summary: 'Listar aplicaciones (ADMIN/GESTOR todas, CODER propias)' })
  @ApiResponse({ status: 200, description: 'Lista de aplicaciones' })
  async findAll(@CurrentUser() currentUser: User) {
    return await this.applicationsService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener aplicación por ID' })
  @ApiParam({ name: 'id', description: 'ID de la aplicación' })
  @ApiResponse({ status: 200, description: 'Aplicación encontrada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    return await this.applicationsService.findOne(id, currentUser);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Actualizar estado de aplicación (ADMIN o GESTOR)' })
  @ApiParam({ name: 'id', description: 'ID de la aplicación' })
  @ApiResponse({ status: 200, description: 'Aplicación actualizada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return await this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar aplicación (Solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la aplicación' })
  @ApiResponse({ status: 200, description: 'Aplicación eliminada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Aplicación no encontrada' })
  async remove(@Param('id') id: string) {
    await this.applicationsService.remove(id);
    return { message: 'Application deleted successfully' };
  }

  @Get('vacancy/:vacancyId/stats')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Estadísticas de aplicaciones por vacante (ADMIN o GESTOR)' })
  @ApiParam({ name: 'vacancyId', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Estadísticas de la vacante' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getVacancyStats(@Param('vacancyId') vacancyId: string) {
    return await this.applicationsService.getVacancyStats(vacancyId);
  }

  @Get('stats/user/:userId')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Estadísticas de aplicaciones por usuario (ADMIN o GESTOR)' })
  @ApiParam({ name: 'userId', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Estadísticas del usuario' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getUserStats(@Param('userId') userId: string) {
    return await this.applicationsService.getUserStats(userId);
  }

  @Get('stats/vacancy/:vacancyId')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Contar aplicaciones de una vacante (ADMIN o GESTOR)' })
  @ApiParam({ name: 'vacancyId', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Número de aplicaciones' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getVacancyApplicationsCount(@Param('vacancyId') vacancyId: string) {
    const count = await this.applicationsService.getVacancyApplicationsCount(vacancyId);
    return { vacancyId, applicationsCount: count };
  }

  @Get('stats/popular/vacancies')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Obtener las 10 vacantes más populares (ADMIN o GESTOR)' })
  @ApiResponse({ status: 200, description: 'Vacantes más populares' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getMostPopularVacancies() {
    return await this.applicationsService.getMostPopularVacancies(10);
  }

  @Get('stats/dashboard')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiOperation({ summary: 'Obtener estadísticas del dashboard (ADMIN o GESTOR)' })
  @ApiResponse({ status: 200, description: 'Estadísticas generales del sistema' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getDashboardStats() {
    return await this.applicationsService.getDashboardStats();
  }
}
