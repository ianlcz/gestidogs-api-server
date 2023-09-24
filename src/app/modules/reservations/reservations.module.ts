import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Reservation, ReservationSchema } from './schemas/reservation.schema';
import { ReservationsService } from './services/reservations.service';
import { ReservationsController } from './controllers/reservations.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { ActivitiesModule } from '../activities/activities.module';
import { EstablishmentsModule } from '../establishments/establishments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    forwardRef(() => SessionsModule),
    forwardRef(() => ActivitiesModule),
    forwardRef(() => EstablishmentsModule),
    forwardRef(() => UsersModule),
  ],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
