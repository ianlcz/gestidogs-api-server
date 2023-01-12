import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../user.schema';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty()
  lastname: string;

  @ApiProperty()
  @IsNotEmpty()
  firstname: string;

  @ApiPropertyOptional({
    enum: ['Admin', 'Educator', 'Client'],
    default: Role.CLIENT,
  })
  role: Role;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  avatarUrl: string;
  registeredAt: Date;
  lastConnectionAt: Date;
}
