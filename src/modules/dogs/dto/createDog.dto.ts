import { Prop } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateDogDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  establishmentId: Types.ObjectId;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  nationalId: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  breed: string;

  birthDate: Date;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  weight: number;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  height: number;
}
