import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsOptional, IsPhoneNumber } from 'class-validator';

import { User } from '../../users/schemas/user.schema';

export class UpdateEstablishmentDto {
  @ApiPropertyOptional({ type: String })
  owner: User;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: String })
  address: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  emailAddress: string;

  @ApiPropertyOptional({ type: 'array' })
  employees: User[];

  @ApiPropertyOptional({
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
