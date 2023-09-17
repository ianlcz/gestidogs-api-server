import { ApiProperty } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { IsMongoId } from 'class-validator';

export class UpdateActivityDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  establishment?: Establishment;

  @ApiProperty({ type: String })
  title?: string;

  @ApiProperty({ type: String })
  description?: string;

  @ApiProperty({ type: String })
  imageUrl?: string;

  @ApiProperty({ type: String })
  color?: string;

  @ApiProperty({ type: Number })
  duration?: number;

  @ApiProperty({ type: Number })
  price?: number;
}
