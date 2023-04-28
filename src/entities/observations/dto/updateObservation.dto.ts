import { ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/dog.schema';

export class UpdateObservationDto {
  @ApiPropertyOptional({ type: String })
  dog: Dog;

  @ApiPropertyOptional({ type: String })
  description: string;

  createdAt: Date;
}
