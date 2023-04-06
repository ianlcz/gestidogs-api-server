import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../../../modules/users/user.schema';

import { IsNotEmpty } from 'class-validator';

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

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
