import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivitiesModule } from '../activities/activities.module';
import { ReservationsModule } from '../reservations/reservations.module';
import { DogsModule } from '../dogs/dogs.module';

import { Session, SessionSchema } from './schemas/session.schema';
import { SessionsController } from './controllers/sessions.controller';
import { SessionsService } from './services/sessions.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    ActivitiesModule,
    ReservationsModule,
    DogsModule,
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
  exports: [SessionsService],
})
export class SessionsModule {}
