import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Observation, ObservationSchema } from './observation.schema';
import { ObservationsService } from './observations.service';
import { ObservationsController } from './observations.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
  providers: [ObservationsService],
  controllers: [ObservationsController],
  exports: [ObservationsService],
})
export class ObservationsModule {}
