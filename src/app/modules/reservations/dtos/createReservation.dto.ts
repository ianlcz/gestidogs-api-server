import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';

export class CreateReservationDto {
  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  slot: Date;

  @ApiProperty({ type: () => [String], required: true })
  @IsNotEmpty()
  dogs: Dog[];

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
