import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/user.schema';
import { Activity } from '../../activities/activity.schema';

import { Status } from '../../../enums/status.enum';
import { Establishment } from 'src/modules/establishments/establishment.schema';

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

  @ApiPropertyOptional({ type: String })
  report: string;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  endDate: Date;
}
