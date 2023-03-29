import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Establishment } from '../../establishments/establishment.schema';
import { User } from '../../users/user.schema';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  owner: User;

  @ApiProperty({ type: String })
  establishment: Establishment;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  nationalId: string;

  @ApiPropertyOptional({ type: String })
  name: string;

  @ApiPropertyOptional({ type: String })
  imageUrl: string;

  @ApiPropertyOptional({ type: String })
  breed: string;

  birthDate: Date;

  @Prop({ type: Number })
  @ApiPropertyOptional({ type: Number })
  weight: number;

  @Prop({ type: Number })
  @ApiPropertyOptional({ type: Number })
  height: number;
}
