import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

import { Role } from '../../../enums/role.enum';

import { Activity } from '../../activities/activity.schema';
import { Dog } from '../../dogs/dog.schema';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  firstname: string;

  @ApiPropertyOptional({
    type: String,
  })
  avatarUrl: string;

  @ApiProperty({ enum: Role, default: Role.CLIENT })
  role: Role;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: Date })
  birthDate: Date;

  activities: Activity[];
  dogs: Dog[];
  registeredAt: Date;
  lastConnectionAt: Date;
  refreshToken: string;
}
