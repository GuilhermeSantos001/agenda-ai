import { Model } from 'mongoose';
import { FindAllCalendarsUseCase } from '../usecases/findAll-calendars.usecase';
import { CalendarDatabaseMongodb } from '../db/calendar.db-mongodb';
import { Calendar } from '../models/calendar.model';

export class FindAllCalendarsFactory {
  static async run(model: Model<Calendar>) {
    const database = new CalendarDatabaseMongodb(model);
    return await FindAllCalendarsUseCase.execute(database);
  }
}
