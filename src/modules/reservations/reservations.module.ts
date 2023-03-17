import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Reservation, ReservationSchema } from './reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
})
export class ReservationsModule {}
