import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import { Activity } from '../../activities/schemas/activity.schema';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export class CreateSessionDto {
  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  educator: User;

  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  activity: Activity | string;

  @ApiProperty({ type: String, required: true })
  @IsMongoId()
  @IsNotEmpty()
  establishment: Establishment | string;

  @ApiProperty({
    enum: StatusSessionType,
    default: StatusSessionType.PENDING,
  })
  status: StatusSessionType;

  @ApiProperty({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;
}
