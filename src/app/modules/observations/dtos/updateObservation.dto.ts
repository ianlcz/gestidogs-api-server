import { ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateObservationDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  dog?: Dog;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  description?: string;

  createdAt?: Date;
}
