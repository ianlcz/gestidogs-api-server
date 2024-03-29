import { ApiProperty } from '@nestjs/swagger';

import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

import { RoleType } from '../../../common/enums/role.enum';

import { Activity } from '../../activities/schemas/activity.schema';
import { Dog } from '../../dogs/schemas/dog.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export class NewEmployeeDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    type: String,
  })
  avatarUrl: string;

  @ApiProperty({
    enum: [RoleType.MANAGER, RoleType.EDUCATOR],
    default: RoleType.EDUCATOR,
  })
  role: RoleType;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ type: Date })
  birthDate: Date;

  @ApiProperty({ type: String })
  stripeId: string;

  @IsArray()
  @IsOptional()
  establishments: Establishment[];

  @IsArray()
  @IsOptional()
  activities: Activity[];

  @IsArray()
  @IsOptional()
  dogs: Dog[];
  registeredAt: Date;
  lastConnectionAt: Date;
  refreshToken: string;
}
