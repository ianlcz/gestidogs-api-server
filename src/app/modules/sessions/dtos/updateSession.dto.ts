import { ApiPropertyOptional } from '@nestjs/swagger';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  educator?: User;

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  activity?: Activity;

  @ApiPropertyOptional({
    enum: StatusSessionType,
    default: StatusSessionType.PENDING,
  })
  @IsOptional()
  status?: StatusSessionType;

  @ApiPropertyOptional({ type: Number, default: 1 })
  @IsOptional()
  maximumCapacity?: number;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  report?: string;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  beginDate?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  endDate?: Date;
}
