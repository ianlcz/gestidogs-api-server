import { ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateActivityTypeDto {
  @ApiPropertyOptional({ type: String })
  establishmentId: Types.ObjectId;

  @ApiPropertyOptional({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: Number })
  duration: number;

  @ApiPropertyOptional({ type: Number })
  maximumCapacity: number;

  @ApiPropertyOptional({ type: Number })
  price: number;
}
