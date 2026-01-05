import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../../common/enums/roles.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre completo del usuario', example: 'María García' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Correo electrónico único', example: 'maria@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Contraseña (mínimo 6 caracteres)', example: 'Pass123!', minLength: 6 })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ description: 'Rol del usuario', enum: UserRole, example: UserRole.CODER })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
