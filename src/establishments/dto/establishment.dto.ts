import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class EstablishmentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  ownerId: Types.ObjectId;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ type: String })
  description: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  address: string;

  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @ApiPropertyOptional({ type: String })
  emailAddress: string;
}
