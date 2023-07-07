import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Log, LogSchema } from '../logs/models/log.model';
import { CalendarProcessor } from './create-calendars.processor';
import { CalendarModule } from 'src/calendar/calendar.module';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'calendars',
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD,
      },
    }),
    MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }]),
    CalendarModule,
  ],
  exports: [BullModule],
  providers: [CalendarProcessor],
})
export class ProcessorsModule {}
