import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray, IsMongoId, IsOptional, IsPhoneNumber } from 'class-validator';

import { User } from '../../users/schemas/user.schema';

export class UpdateEstablishmentDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  owner?: User;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  emailAddress?: string;

  @ApiPropertyOptional({ type: 'array' })
  @IsOptional()
  employees?: User[];

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
  @IsOptional()
  @IsArray()
  schedules?: [{ startTime?: string; endTime?: string }][];
}
