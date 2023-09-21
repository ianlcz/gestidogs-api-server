import { ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateActivityDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  establishment?: Establishment;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  duration?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  price?: number;
}
