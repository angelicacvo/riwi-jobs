import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VacanciesService } from './vacancies.service';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { UpdateVacancyDto } from './dto/update-vacancy.dto';
import { QueryVacancyDto } from './dto/query-vacancy.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/roles.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';

@ApiTags('Vacancies')
@Controller('vacancies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VacanciesController {
  constructor(private readonly vacanciesService: VacanciesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Crear nueva vacante (ADMIN o GESTOR)' })
  @ApiResponse({ status: 201, description: 'Vacante creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async create(@Body() createVacancyDto: CreateVacancyDto) {
    return await this.vacanciesService.create(createVacancyDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Listar todas las vacantes con filtros (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de vacantes paginada' })
  async findAll(@Query() queryDto: QueryVacancyDto) {
    return await this.vacanciesService.findAll(queryDto);
  }

  @Get('available/slots')
  @Public()
  @ApiOperation({ summary: 'Obtener vacantes con cupos disponibles (Público)' })
  @ApiResponse({ status: 200, description: 'Lista de vacantes con cupos disponibles' })
  async findAvailableVacancies() {
    return await this.vacanciesService.findAvailableVacancies();
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Obtener vacante por ID (Público)' })
  @ApiParam({ name: 'id', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Vacante encontrada' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async findOne(@Param('id') id: string) {
    return await this.vacanciesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Actualizar vacante (ADMIN o GESTOR)' })
  @ApiParam({ name: 'id', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Vacante actualizada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async update(@Param('id') id: string, @Body() updateVacancyDto: UpdateVacancyDto) {
    return await this.vacanciesService.update(id, updateVacancyDto);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Activar/Desactivar vacante (ADMIN o GESTOR)' })
  @ApiParam({ name: 'id', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Estado de vacante actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async toggleActive(@Param('id') id: string) {
    return await this.vacanciesService.toggleActive(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Eliminar vacante (Solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Vacante eliminada' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async remove(@Param('id') id: string) {
    await this.vacanciesService.remove(id);
    return { message: 'Vacancy deleted successfully' };
  }

  @Get('stats/:id')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Obtener estadísticas de una vacante (ADMIN o GESTOR)' })
  @ApiParam({ name: 'id', description: 'ID de la vacante' })
  @ApiResponse({ status: 200, description: 'Estadísticas de la vacante' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Vacante no encontrada' })
  async getVacancyStats(@Param('id') id: string) {
    return await this.vacanciesService.getVacancyStats(id);
  }

  @Get('stats/general/overview')
  @Roles(UserRole.ADMIN, UserRole.GESTOR)
  @ApiBearerAuth('JWT-auth')
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Obtener estadísticas generales de vacantes (ADMIN o GESTOR)' })
  @ApiResponse({ status: 200, description: 'Estadísticas generales' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getGeneralStats() {
    return await this.vacanciesService.getGeneralStats();
  }
}
