import { Id } from 'src/common/types/id.type';
import { RepositoriesContract } from '../../common/contracts/repositories.contract';
import { Calendar } from '../models/calendar.model';

export class CalendarRepository extends RepositoriesContract<Calendar> {
  async register(data: Calendar): Promise<Calendar | Error> {
    const calendar = await this.database.create(data);

    if (!calendar) throw new Error(`Calendar not registered!`);

    return calendar;
  }

  async upgrade(id: Id, data: Partial<Calendar>): Promise<Calendar | Error> {
    const calendar = await this.database.update(id, data);

    if (!calendar) throw new Error(`Calendar not updated!`);

    return calendar;
  }

  async get(id: Id): Promise<Calendar | Error> {
    const calendar = await this.database.findOne(id);

    if (!calendar) throw new Error(`Calendar not exists!`);

    return calendar;
  }

  async getAll(): Promise<Calendar[]> {
    return await this.database.findAll();
  }

  async unregister(id: Id): Promise<boolean> {
    return await this.database.delete(id);
  }
}
