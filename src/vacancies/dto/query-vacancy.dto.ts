import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ModalityEnum } from '../../common/enums/modality.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryVacancyDto {
  @ApiPropertyOptional({ description: 'Filtrar por empresa', example: 'TechCorp' })
  @IsOptional()
  @IsString()
  company?: string;

  @ApiPropertyOptional({ description: 'Filtrar por ubicación', example: 'Medellín' })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({ description: 'Filtrar por modalidad', enum: ModalityEnum, example: ModalityEnum.REMOTE })
  @IsOptional()
  @IsEnum(ModalityEnum)
  modality?: ModalityEnum;

  @ApiPropertyOptional({ description: 'Filtrar por vacantes activas', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Filtrar vacantes con cupos disponibles', example: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  hasAvailableSlots?: boolean;

  @ApiPropertyOptional({ description: 'Orden ascendente o descendente', enum: ['ASC', 'DESC'], example: 'DESC' })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';

  @ApiPropertyOptional({ description: 'Campo por el cual ordenar', example: 'createdAt' })
  @IsOptional()
  @IsString()
  orderBy?: string;

  @ApiPropertyOptional({ description: 'Número de página', example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Elementos por página', example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;
}
