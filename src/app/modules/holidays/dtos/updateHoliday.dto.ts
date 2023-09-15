import { ApiProperty } from '@nestjs/swagger';

import { User } from '../../users/schemas/user.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';
import { IsMongoId } from 'class-validator';

export class UpdateHolidayDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  employee: User;

  @ApiProperty({ type: String })
  establishment: Establishment;

  @ApiProperty({ type: Date })
  beginDate: Date;

  @ApiProperty({ type: Date })
  endDate: Date;

  @ApiProperty({
    enum: StatusHolidayType,
    default: StatusHolidayType.PENDING,
  })
  status: StatusHolidayType;

  @ApiProperty({ type: Boolean, default: false })
  isApproved: boolean;
}
