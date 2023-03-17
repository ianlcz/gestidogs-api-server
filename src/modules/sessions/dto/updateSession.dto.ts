import { ApiPropertyOptional } from '@nestjs/swagger';

import { Status } from '../../../enums/status.enum';

import { User } from '../../users/user.schema';
import { Activity } from '../../activities/activity.schema';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String })
  educator: User;

  @ApiPropertyOptional({ type: String })
  activity: Activity;

  @ApiPropertyOptional({
    enum: Status,
    default: Status.PENDING,
  })
  status: Status;

  @ApiPropertyOptional({ type: Number, default: 1 })
  maximumCapacity: number;

  @ApiPropertyOptional({ type: String })
  report: string;

  @ApiPropertyOptional({ type: Date })
  beginDate: Date;

  @ApiPropertyOptional({ type: Date })
  endDate: Date;
}
