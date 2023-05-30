import { ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../../users/schemas/user.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';

export class UpdateHolidayDto {
  @ApiPropertyOptional({ type: String })
  employee: User;

  @ApiPropertyOptional({ type: Date })
  beginDate: Date;

  @ApiPropertyOptional({ type: Date })
  endDate: Date;

  @ApiPropertyOptional({
    enum: StatusHolidayType,
    default: StatusHolidayType.PENDING,
  })
  status: StatusHolidayType;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
