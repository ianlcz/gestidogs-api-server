import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty, MinLength } from 'class-validator';
import { Types } from 'mongoose';

import { Status } from '../../../enums/status.enum';

export class CreateSessionDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  educatorId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  activityId: Types.ObjectId;

  @ApiProperty({
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  maxCapacity: number;

  @ApiPropertyOptional({ type: String })
  @MinLength(40)
  report: string;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  endDate: Date;
}
