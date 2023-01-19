import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { Role } from '../enums/role.enum';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  firstname: string;

  @ApiPropertyOptional({
    enum: ['Admin', 'Educator', 'Client'],
    default: Role.CLIENT,
  })
  role: Role;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  avatarUrl: string;
  registeredAt: Date;
  lastConnectionAt: Date;
}
