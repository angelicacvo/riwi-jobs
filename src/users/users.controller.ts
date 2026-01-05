import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/roles.enum';
import { User } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiSecurity, ApiParam } from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@ApiSecurity('x-api-key')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Crear nuevo usuario (Solo ADMIN)' })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El email ya existe' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Listar todos los usuarios (Solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async findAll() {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID (ADMIN o propio usuario)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario encontrado' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException(
        'You can only view your own profile or be an administrator',
      );
    }
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar usuario (ADMIN o propio usuario)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario actualizado' })
  @ApiResponse({ status: 403, description: 'Sin permisos para esta acción' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException(
        'You can only update your own profile or be an administrator',
      );
    }
    return await this.usersService.update(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Eliminar usuario (Solo ADMIN)' })
  @ApiParam({ name: 'id', description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Usuario eliminado' })
  @ApiResponse({ status: 400, description: 'No puede eliminar su propia cuenta o el último admin' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User) {
    await this.usersService.remove(id, currentUser);
    return { message: 'User deleted successfully' };
  }

  @Get('stats/overview')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Obtener estadísticas de usuarios (Solo ADMIN)' })
  @ApiResponse({ status: 200, description: 'Estadísticas de usuarios' })
  @ApiResponse({ status: 403, description: 'Sin permisos' })
  async getUsersStats() {
    return await this.usersService.getUsersStats();
  }
}
