import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Id } from 'src/common/types/id.type';
import { NewCalendarInput } from './dto/new-calendar.input';
import { Calendar } from './models/calendar.model';

import { CreateCalendarFactory } from './factories/create-calendar.factory';
import { UpdateCalendarFactory } from './factories/update-calendar.factory';
import { FindAllCalendarsFactory } from './factories/findAll-calendars.factory';
import { FindByIdCalendarFactory } from './factories/findById-calendars.factory';
import { RemoveCalendarFactory } from './factories/remove-calendars.factory';

@Injectable()
export class CalendarService {
  constructor(
    @InjectModel(Calendar.name) private calendarModel: Model<Calendar>,
  ) {}

  async create(data: NewCalendarInput): Promise<Calendar | Error> {
    return await CreateCalendarFactory.run(data, this.calendarModel);
  }

  async update(id: Id, data: Partial<Calendar>): Promise<Calendar | Error> {
    return await UpdateCalendarFactory.run(id, data, this.calendarModel);
  }

  async findOneById(id: string): Promise<Calendar | Error> {
    return await FindByIdCalendarFactory.run(id, this.calendarModel);
  }

  async findAll(): Promise<Calendar[]> {
    return await FindAllCalendarsFactory.run(this.calendarModel);
  }

  async remove(id: string): Promise<boolean> {
    return await RemoveCalendarFactory.run(id, this.calendarModel);
  }
}
