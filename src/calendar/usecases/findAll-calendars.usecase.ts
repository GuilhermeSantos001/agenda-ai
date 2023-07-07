import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';
import { CalendarRepository } from '../repos/calendar.repository';

export class FindAllCalendarsUseCase {
  static async execute(database: DatabaseContract<Calendar>) {
    const repository = new CalendarRepository(database);
    return await repository.getAll();
  }
}
