import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateEstablishmentDto {
  @ApiProperty({ type: String, required: true })
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: String, required: true })
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  emailAddress: string;
}
