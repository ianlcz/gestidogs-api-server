import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Session } from '../../sessions/schemas/session.schema';

export class CreateReservationDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  session: Session;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsMongoId()
  dog: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
