import { ApiProperty } from '@nestjs/swagger';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { IsMongoId } from 'class-validator';

export class UpdateSessionDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  educator: User;

  @ApiProperty({ type: String })
  @IsMongoId()
  activity: Activity;

  @ApiProperty({
    enum: StatusSessionType,
    default: StatusSessionType.PENDING,
  })
  status: StatusSessionType;

  @ApiProperty({ type: Number, default: 1 })
  maximumCapacity: number;

  @ApiProperty({ type: String })
  report: string;

  @ApiProperty({ type: Date })
  beginDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;
}
