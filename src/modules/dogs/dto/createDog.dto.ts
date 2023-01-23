import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDogDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  breed: string;

  birthDate: Date;
}
