import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateEstablishmentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  emailAddress: string;

  @ApiPropertyOptional({
    type: Array<[{ beginDate: Date; endDate: Date }]>,
    default: [],
  })
  schedules: [{ beginDate: Date; endDate: Date }][];
}
