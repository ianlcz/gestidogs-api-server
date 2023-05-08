import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Session } from '../../sessions/schemas/session.schema';

export class CreateReservationDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  session: Session;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  dog: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
