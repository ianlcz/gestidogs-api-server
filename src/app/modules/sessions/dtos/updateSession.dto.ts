import { ApiPropertyOptional } from '@nestjs/swagger';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String })
  educator: User;

  @ApiPropertyOptional({ type: String })
  activity: Activity;

  @ApiPropertyOptional({
    enum: StatusSessionType,
    default: StatusSessionType.PENDING,
  })
  status: StatusSessionType;

  @ApiPropertyOptional({ type: Number, default: 1 })
  maximumCapacity: number;

  @ApiPropertyOptional({ type: String })
  report: string;

  @ApiPropertyOptional({ type: Date })
  beginDate: Date;

  endDate: Date;
}
