import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Activity, ActivitySchema } from './activity.schema';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
