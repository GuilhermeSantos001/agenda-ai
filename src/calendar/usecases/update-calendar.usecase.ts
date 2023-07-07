import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';
import { CalendarRepository } from '../repos/calendar.repository';
import { Id } from 'src/common/types/id.type';

export class UpdateCalendarUseCase {
  static async execute(
    id: Id,
    input: Partial<Calendar>,
    database: DatabaseContract<Calendar>,
  ) {
    const repository = new CalendarRepository(database);
    return await repository.upgrade(id, input);
  }
}
