import { ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { IsMongoId } from 'class-validator';

export class UpdateActivityDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  establishment: Establishment;

  @ApiPropertyOptional({ type: String })
  title: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiPropertyOptional({ type: String })
  color: string;

  @ApiPropertyOptional({ type: Number })
  duration: number;

  @ApiPropertyOptional({ type: Number })
  price: number;
}
