import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export class CreateHolidayDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  employee: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  establishment: Establishment;

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

  isApproved: boolean;
}
