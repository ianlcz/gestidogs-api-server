import { ApiProperty } from '@nestjs/swagger';

import { IsMongoId, IsNotEmpty } from 'class-validator';

import { User } from '../../users/schemas/user.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';
import { GenderType } from '../../../common/enums/gender.enum';
import { Session } from '../../sessions/schemas/session.schema';

export class CreateDogDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  owner: User;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  establishment: Establishment;

  @ApiProperty({ type: [String], default: [] })
  sessions: [Session];

  @ApiProperty({ type: String })
  @IsNotEmpty()
  nationalId: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ type: String })
  imageUrl: string;

  @ApiProperty({
    enum: GenderType,
    examples: [GenderType.MALE, GenderType.FEMALE],
  })
  gender: GenderType;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  breed: string;

  birthDate: Date;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  weight: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  height: number;
}
