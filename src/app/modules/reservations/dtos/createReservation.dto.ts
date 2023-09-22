import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { Session } from '../../sessions/schemas/session.schema';

export class CreateReservationDto {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  activity: Activity;

  @ApiProperty({ type: String })
  @IsMongoId()
  session: Session;

  @ApiProperty({ type: () => [String], required: true })
  @IsNotEmpty()
  dogs: Dog[];

  @ApiProperty({ type: Boolean, default: false })
  isApproved: boolean;
}
