import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { Establishment } from '../../establishments/schemas/establishment.schema';

export class CreateActivityDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  establishment: Establishment;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  color: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  price: number;
}
