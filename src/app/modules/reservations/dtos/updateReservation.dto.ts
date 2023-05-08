import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Session } from '../../sessions/schemas/session.schema';

export class UpdateReservationDto {
  @ApiProperty({ type: String })
  session: Session;

  @ApiProperty({ type: String })
  dog: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
