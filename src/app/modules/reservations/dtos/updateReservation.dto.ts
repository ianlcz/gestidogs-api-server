import { ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { IsMongoId, IsOptional } from 'class-validator';
import { Activity } from '../../activities/schemas/activity.schema';

export class UpdateReservationDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  activity?: Activity;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  dog?: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  isApproved?: boolean;
}
