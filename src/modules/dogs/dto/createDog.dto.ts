import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/user.schema';
import { Establishment } from '../../establishments/establishment.schema';

export class CreateDogDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  owner: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  establishment: Establishment;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  nationalId: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

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
