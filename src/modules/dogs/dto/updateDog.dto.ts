import { Prop } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

export class UpdateDogDto {
  @ApiProperty({ type: String })
  ownerId: Types.ObjectId;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  nationalId: string;

  @ApiPropertyOptional({ type: String })
  name: string;

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
