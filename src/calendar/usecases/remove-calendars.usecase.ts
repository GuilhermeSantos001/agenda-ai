import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';
import { CalendarRepository } from '../repos/calendar.repository';

export class RemoveCalendarUseCase {
  static async execute(id: string, database: DatabaseContract<Calendar>) {
    const repository = new CalendarRepository(database);
    return await repository.unregister(id);
  }
}
