import { ApiProperty } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { IsMongoId } from 'class-validator';
import { Activity } from '../../activities/schemas/activity.schema';

export class UpdateReservationDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  activity: Activity;

  @ApiProperty({ type: String })
  @IsMongoId()
  dog: Dog;

  @ApiProperty({ type: Boolean, default: false })
  isApproved: boolean;
}
