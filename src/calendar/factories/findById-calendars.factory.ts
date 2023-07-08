import { Model } from 'mongoose';
import { FindByIdCalendarUseCase } from '../usecases/findById-calendars.usecase';
import { CalendarDatabaseMongodb } from '../db/calendar.db-mongodb';
import { Calendar } from '../models/calendar.model';

export class FindByIdCalendarFactory {
  static async run(id: string, model: Model<Calendar>) {
    const database = new CalendarDatabaseMongodb(model);
    return await FindByIdCalendarUseCase.execute(id, database);
  }
}
