import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

import { User } from '../../users/schemas/user.schema';

export class CreateEstablishmentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  owner: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  address: string;

  @ApiProperty({ type: [Number], required: true })
  coordinates: number[];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiPropertyOptional({ type: 'array' })
  employees: User[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      properties: {
        startTime: { type: 'string' },
        endTime: { type: 'string' },
      },
    },
    default: [],
  })
  @IsArray()
  schedules: [{ startTime: string; endTime: string }][];
}
