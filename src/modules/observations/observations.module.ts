import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Observation, ObservationSchema } from './observation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Observation.name, schema: ObservationSchema },
    ]),
  ],
})
export class ObservationsModule {}
