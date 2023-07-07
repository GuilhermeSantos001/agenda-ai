import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CalendarService } from './calendar.service';
import { Calendar, CalendarSchema } from './models/calendar.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Calendar.name, schema: CalendarSchema },
    ]),
  ],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
