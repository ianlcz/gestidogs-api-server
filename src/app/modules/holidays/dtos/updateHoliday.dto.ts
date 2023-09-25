import { ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../../users/schemas/user.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';
import { IsMongoId, IsOptional } from 'class-validator';

export class UpdateHolidayDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  employee?: User;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  establishment?: Establishment;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  beginDate?: Date;

  @ApiPropertyOptional({ type: Date })
  @IsOptional()
  endDate?: Date;

  @ApiPropertyOptional({
    enum: StatusHolidayType,
    default: StatusHolidayType.PENDING,
  })
  @IsOptional()
  status?: StatusHolidayType;

  @ApiPropertyOptional({ type: Boolean, default: false })
  @IsOptional()
  isApproved?: boolean;
}
