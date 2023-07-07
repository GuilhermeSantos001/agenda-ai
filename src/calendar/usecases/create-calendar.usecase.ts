import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';
import { CalendarRepository } from '../repos/calendar.repository';
import { NewCalendarInput } from '../dto/new-calendar.input';

export class CreateCalendarUseCase {
  static async execute(
    input: NewCalendarInput,
    database: DatabaseContract<Calendar>,
  ) {
    const repository = new CalendarRepository(database);
    return await repository.register({
      ...input,
      id: database.generateUUID(),
      timestamp: Date.now(),
      schedules: [],
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
