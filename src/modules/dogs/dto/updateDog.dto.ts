import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/establishment.schema';
import { User } from '../../users/user.schema';
import { Gender } from '../../../enums/gender.enum';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  owner: User;

  @ApiProperty({ type: String })
  establishment: Establishment;

  @ApiPropertyOptional({ type: String })
  nationalId: string;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiPropertyOptional({ enum: Gender })
  gender: Gender;

  @ApiPropertyOptional({ type: String })
  breed: string;

  birthDate: Date;

  @ApiPropertyOptional({ type: Number })
  weight: number;

  @ApiPropertyOptional({ type: Number })
  height: number;
}
