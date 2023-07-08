import { Model } from 'mongoose';
import { RemoveCalendarUseCase } from '../usecases/remove-calendars.usecase';
import { CalendarDatabaseMongodb } from '../db/calendar.db-mongodb';
import { Calendar } from '../models/calendar.model';

export class RemoveCalendarFactory {
  static async run(id: string, model: Model<Calendar>) {
    const database = new CalendarDatabaseMongodb(model);
    return await RemoveCalendarUseCase.execute(id, database);
  }
}
