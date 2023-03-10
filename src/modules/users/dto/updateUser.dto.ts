import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsOptional, MinLength } from 'class-validator';

import { Activity } from '../../activities/activity.schema';
import { Dog } from '../../dogs/dog.schema';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  lastname: string;

  @ApiProperty()
  @IsOptional()
  firstname: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional()
  avatarUrl: string;

  dogs: Dog[];
  activities: Activity[];
}
