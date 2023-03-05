import { ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

import { Status } from '../../../enums/status.enum';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String, required: true })
  educatorId: Types.ObjectId;

  @ApiPropertyOptional({ type: String, required: true })
  activityId: Types.ObjectId;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ApiPropertyOptional({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @ApiPropertyOptional({ type: String })
  report: string;

  @ApiPropertyOptional({ type: Date, required: true })
  beginDate: Date;

  @ApiPropertyOptional({ type: Date, required: true })
  endDate: Date;
}
