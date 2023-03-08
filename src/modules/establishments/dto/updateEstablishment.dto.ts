import { ApiPropertyOptional } from '@nestjs/swagger';

import { IsArray } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateEstablishmentDto {
  @ApiPropertyOptional({ type: String })
  ownerId: Types.ObjectId;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: String })
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  emailAddress: string;

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
