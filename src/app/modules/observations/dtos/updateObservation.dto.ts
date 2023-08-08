import { ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { IsMongoId } from 'class-validator';

export class UpdateObservationDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  dog: Dog;

  @ApiPropertyOptional({ type: String })
  description: string;

  createdAt: Date;
}
