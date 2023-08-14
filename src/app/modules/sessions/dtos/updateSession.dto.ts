import { ApiPropertyOptional } from '@nestjs/swagger';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { IsMongoId } from 'class-validator';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  educator: User;

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
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

  @ApiPropertyOptional({ type: Date })
  endDate: Date;
}
