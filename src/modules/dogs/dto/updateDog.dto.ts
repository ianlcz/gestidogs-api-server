import { ApiProperty } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateDogDto {
  @ApiProperty({ type: String, required: true })
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  name: string;

  @ApiProperty({ type: String, required: true })
  breed: string;

  birthDate: Date;
}
