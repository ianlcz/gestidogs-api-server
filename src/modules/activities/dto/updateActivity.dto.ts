import { ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/establishment.schema';

export class UpdateActivityDto {
  @ApiPropertyOptional({ type: String })
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
