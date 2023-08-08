import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Session } from '../../sessions/schemas/session.schema';
import { IsMongoId } from 'class-validator';

export class UpdateReservationDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  session: Session;

  @ApiProperty({ type: String })
  @IsMongoId()
  dog: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
