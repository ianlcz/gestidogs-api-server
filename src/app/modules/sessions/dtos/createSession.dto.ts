import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';

import { StatusType } from 'src/app/common/enums/Status.enum';
import { Establishment } from '../../establishments/schemas/establishment.schema';

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
    enum: StatusType,
    default: StatusType.PENDING,
  })
  status: StatusType;

  @ApiProperty({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  endDate: Date;
}
