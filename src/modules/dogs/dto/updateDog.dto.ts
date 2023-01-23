import { ApiProperty } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  breed: string;

  birthDate: Date;
}
