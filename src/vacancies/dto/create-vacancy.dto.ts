import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ModalityEnum } from '../../common/enums/modality.enum';

export class CreateVacancyDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  technologies: string;

  @IsNotEmpty()
  @IsString()
  seniority: string;

  @IsOptional()
  @IsString()
  softSkills?: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  @IsEnum(ModalityEnum)
  modality: ModalityEnum;

  @IsNotEmpty()
  @IsString()
  salaryRange: string;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  maxApplicants: number;
}
