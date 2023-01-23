import { ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateEstablishmentDto {
  @ApiPropertyOptional({ type: String })
  ownerId: Types.ObjectId;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiPropertyOptional({ type: String })
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  emailAddress: string;
}
