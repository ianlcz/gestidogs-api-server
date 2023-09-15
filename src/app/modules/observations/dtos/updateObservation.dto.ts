import { ApiProperty } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { IsMongoId } from 'class-validator';

export class UpdateObservationDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  dog: Dog;

  @ApiProperty({ type: String })
  description: string;

  createdAt: Date;
}
