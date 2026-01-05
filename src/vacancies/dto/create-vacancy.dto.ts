import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ModalityEnum } from '../../common/enums/modality.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVacancyDto {
  @ApiProperty({ description: 'Título de la vacante', example: 'Desarrollador Full Stack Senior' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ description: 'Descripción detallada de la vacante', example: 'Buscamos desarrollador con experiencia en React y Node.js' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Tecnologías requeridas', example: 'React, Node.js, PostgreSQL, TypeScript' })
  @IsNotEmpty()
  @IsString()
  technologies: string;

  @ApiProperty({ description: 'Nivel de seniority', example: 'Senior' })
  @IsNotEmpty()
  @IsString()
  seniority: string;

  @ApiPropertyOptional({ description: 'Habilidades blandas requeridas', example: 'Trabajo en equipo, Comunicación efectiva' })
  @IsOptional()
  @IsString()
  softSkills?: string;

  @ApiProperty({ description: 'Ubicación del trabajo', example: 'Medellín, Colombia' })
  @IsNotEmpty()
  @IsString()
  location: string;

  @ApiProperty({ description: 'Modalidad de trabajo', enum: ModalityEnum, example: ModalityEnum.REMOTE })
  @IsNotEmpty()
  @IsEnum(ModalityEnum)
  modality: ModalityEnum;

  @ApiProperty({ description: 'Rango salarial', example: '$3.000.000 - $5.000.000 COP' })
  @IsNotEmpty()
  @IsString()
  salaryRange: string;

  @ApiProperty({ description: 'Nombre de la empresa', example: 'TechCorp Colombia' })
  @IsNotEmpty()
  @IsString()
  company: string;

  @ApiProperty({ description: 'Número máximo de aplicantes', example: 10, minimum: 1 })
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxApplicants: number;
}
