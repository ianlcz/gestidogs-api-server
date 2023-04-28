import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Dog } from '../../dogs/dog.schema';
import { Session } from '../../sessions/session.schema';

export class UpdateReservationDto {
  @ApiProperty({ type: String })
  session: Session;

  @ApiProperty({ type: String })
  dog: Dog;

  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;
}
