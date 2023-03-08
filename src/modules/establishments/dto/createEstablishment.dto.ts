import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsEmail, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEstablishmentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

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
