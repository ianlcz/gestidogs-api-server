import { ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../../users/schemas/user.schema';

export class UpdateHolidayDto {
  @ApiPropertyOptional({ type: String })
  employee: User;

  @ApiPropertyOptional({ type: Date })
  beginDate: Date;

  @ApiPropertyOptional({ type: Date })
  endDate: Date;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
