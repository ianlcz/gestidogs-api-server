import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { User } from '../../users/schemas/user.schema';
import { GenderType } from '../../../common/enums/gender.enum';
import { IsMongoId } from 'class-validator';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  owner: User;

  @ApiProperty({ type: String })
  @IsMongoId()
  establishment: Establishment;

  @ApiPropertyOptional({ type: String })
  nationalId: string;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiPropertyOptional({
    enum: GenderType,
    examples: [GenderType.MALE, GenderType.FEMALE],
  })
  gender?: GenderType;

  @ApiPropertyOptional({ type: String })
  breed: string;

  birthDate: Date;

  @ApiPropertyOptional({ type: Number })
  weight: number;

  @ApiPropertyOptional({ type: Number })
  height: number;
}
