import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ActivityType, ActivityTypeSchema } from './activity-type.schema';
import { ActivityTypesController } from './activity-types.controller';
import { ActivityTypesService } from './activity-types.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ActivityType.name, schema: ActivityTypeSchema },
    ]),
  ],
  controllers: [ActivityTypesController],
  providers: [ActivityTypesService],
})
export class ActivityTypesModule {}
