import { ApiProperty } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { User } from '../../users/schemas/user.schema';
import { GenderType } from '../../../common/enums/gender.enum';
import { IsMongoId } from 'class-validator';
import { Session } from '../../sessions/schemas/session.schema';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  owner: User;

  @ApiProperty({ type: String })
  @IsMongoId()
  establishment: Establishment;

  @ApiProperty({ type: String })
  nationalId: string;

  @ApiProperty({ type: [String], default: [] })
  sessions: [Session];

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  imageUrl: string;

  @ApiProperty({
    enum: GenderType,
    examples: [GenderType.MALE, GenderType.FEMALE],
  })
  gender: GenderType;

  @ApiProperty({ type: String })
  breed: string;

  birthDate: Date;

  @ApiProperty({ type: Number })
  weight: number;

  @ApiProperty({ type: Number })
  height: number;
}
