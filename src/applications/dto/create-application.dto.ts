import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApplicationDto {
  @IsNotEmpty()
  @IsUUID()
  vacancyId: string;
}
