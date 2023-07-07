import { Model } from 'mongoose';
import { CreateCalendarUseCase } from '../usecases/create-calendar.usecase';
import { CalendarDatabaseMongodb } from '../db/calendar.db-mongodb';
import { Calendar } from '../models/calendar.model';
import { NewCalendarInput } from '../dto/new-calendar.input';

export class CreateCalendarFactory {
  static async run(input: NewCalendarInput, model: Model<Calendar>) {
    const database = new CalendarDatabaseMongodb(model);
    return await CreateCalendarUseCase.execute(input, database);
  }
}
