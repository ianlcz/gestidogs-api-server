import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';

export class CreateObservationDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  dog: Dog;

  @ApiProperty({ type: String })
  description: string;

  createdAt: Date;
}
