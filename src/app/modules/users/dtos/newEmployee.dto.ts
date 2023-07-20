import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MinLength,
} from 'class-validator';

import { RoleType } from '../../../common/enums/role.enum';

import { Activity } from '../../activities/schemas/activity.schema';
import { Dog } from '../../dogs/schemas/dog.schema';

export class NewEmployeeDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  firstname: string;

  @ApiPropertyOptional({
    type: String,
  })
  avatarUrl?: string;

  @ApiProperty({
    enum: [RoleType.MANAGER, RoleType.EDUCATOR],
    default: RoleType.EDUCATOR,
  })
  role: RoleType;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: Date })
  birthDate?: Date;

  @ApiPropertyOptional({ type: String })
  stripeId?: string;

  activities?: Activity[];
  dogs?: Dog[];
  registeredAt: Date;
  lastConnectionAt: Date;
  refreshToken: string;
}
