import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';

export class CreateObservationDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  dog: Dog;

  @ApiPropertyOptional({ type: String })
  description: string;

  createdAt: Date;
}
