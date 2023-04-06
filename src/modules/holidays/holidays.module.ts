import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Holiday, HolidaySchema } from './holiday.schema';
import { HolidaysService } from './holidays.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Holiday.name, schema: HolidaySchema }]),
  ],
  providers: [HolidaysService],
  exports: [HolidaysService],
})
export class HolidaysModule {}
