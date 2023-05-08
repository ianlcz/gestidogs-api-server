import { ApiPropertyOptional } from '@nestjs/swagger';

import { StatusType } from '../../../common/enums/status.enum';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String })
  educator: User;

  @ApiPropertyOptional({ type: String })
  activity: Activity;

  @ApiPropertyOptional({
    enum: StatusType,
    default: StatusType.PENDING,
  })
  status: StatusType;

  @ApiPropertyOptional({ type: Number, default: 1 })
  maximumCapacity: number;

  @ApiPropertyOptional({ type: String })
  report: string;

  @ApiPropertyOptional({ type: Date })
  beginDate: Date;

  endDate: Date;
}
