import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

import { Activity } from '../../activities/schemas/activity.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

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

  @ApiProperty({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber: string;

  @ApiProperty()
  @IsOptional()
  @MinLength(8)
  password: string;

  @ApiProperty()
  avatarUrl: string;

  @ApiProperty({ type: String })
  stripeId: string;

  @IsArray()
  @IsOptional()
  establishments: Establishment[];

  @IsArray()
  @IsOptional()
  activities: Activity[];
}
