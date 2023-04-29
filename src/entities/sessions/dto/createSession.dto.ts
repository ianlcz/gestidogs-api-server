import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/user.schema';
import { Activity } from '../../activities/activity.schema';

import { Status } from '../../../enums/status.enum';
import { Establishment } from '../../establishments/establishment.schema';

export class CreateSessionDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  educator: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  activity: Activity;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  establishment: Establishment;

  @ApiProperty({
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ApiProperty({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  endDate: Date;
}