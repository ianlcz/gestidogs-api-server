import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';

export class CreateHolidayDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  employee: User;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  beginDate: Date;

  @ApiProperty({ type: Date, required: true })
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty({
    enum: StatusHolidayType,
    default: StatusHolidayType.PENDING,
  })
  status: StatusHolidayType;

  isApproved?: boolean;
}
