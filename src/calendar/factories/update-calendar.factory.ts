import { Model } from 'mongoose';
import { UpdateCalendarUseCase } from '../usecases/update-calendar.usecase';
import { CalendarDatabaseMongodb } from '../db/calendar.db-mongodb';
import { Calendar } from '../models/calendar.model';
import { Id } from 'src/common/types/id.type';

export class UpdateCalendarFactory {
  static async run(id: Id, input: Partial<Calendar>, model: Model<Calendar>) {
    const database = new CalendarDatabaseMongodb(model);
    return await UpdateCalendarUseCase.execute(id, input, database);
  }
}
