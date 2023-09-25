import { ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/schemas/establishment.schema';
import { User } from '../../users/schemas/user.schema';
import { GenderType } from '../../../common/enums/gender.enum';
import { IsMongoId, IsOptional } from 'class-validator';
import { Session } from '../../sessions/schemas/session.schema';

export class UpdateDogDto {
  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  owner?: User;

  @ApiPropertyOptional({ type: String })
  @IsMongoId()
  @IsOptional()
  establishment?: Establishment;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  nationalId?: string;

  @ApiPropertyOptional({ type: [String], default: [] })
  @IsOptional()
  sessions?: [Session];

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ type: String })
  imageUrl?: string;

  @ApiPropertyOptional({
    enum: GenderType,
    examples: [GenderType.MALE, GenderType.FEMALE],
  })
  @IsOptional()
  gender?: GenderType;

  @ApiPropertyOptional({ type: String })
  @IsOptional()
  breed?: string;

  birthDate?: Date;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  weight?: number;

  @ApiPropertyOptional({ type: Number })
  @IsOptional()
  height?: number;
}
