import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

import { User } from '../../users/user.schema';
import { Establishment } from '../../establishments/establishment.schema';
import { Gender } from '../../../enums/gender.enum';

export class CreateDogDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  owner: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  establishment: Establishment;

  @ApiProperty({ type: String, required: true })
  nationalId: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiPropertyOptional({
    enum: Gender,
    examples: [Gender.MALE, Gender.FEMALE],
  })
  gender?: Gender;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  breed: string;

  birthDate: Date;

  @ApiProperty({ type: Number })
  weight: number;

  @ApiProperty({ type: Number })
  height: number;
}
