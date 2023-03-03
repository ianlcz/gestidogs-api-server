import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateActivityDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  establishmentId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  duration: number;

  @ApiPropertyOptional({ type: Number })
  maximumCapacity: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  price: number;
}
