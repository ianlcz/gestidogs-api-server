import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Activity, ActivitySchema } from './schemas/activity.schema';
import { ActivitiesController } from './controllers/activities.controller';
import { ActivitiesService } from './services/activities.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
  exports: [ActivitiesService],
})
export class ActivitiesModule {}
