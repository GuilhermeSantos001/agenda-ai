import { Id } from '../../common/types/id.type';
import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';

export class CalendarDatabaseMemory extends DatabaseContract<Calendar> {
  constructor(private calendars: Calendar[] = []) {
    super();
  }

  private _hasExist(id: Id) {
    return this.calendars.findIndex((_d) => _d.id === id) !== -1;
  }

  create(data: Calendar): Promise<false | Calendar> {
    this.calendars.push(data);
    return Promise.resolve(data);
  }

  update(id: Id, data: Partial<Calendar>): Promise<false | Calendar> {
    const index = this.calendars.findIndex((_d) => _d.id === id);

    if (index === -1) return Promise.resolve(false);

    this.calendars[index] = { ...this.calendars[index], ...data };

    return Promise.resolve(this.calendars[index]);
  }

  findOne(id: Id): Promise<false | Calendar> {
    const doctor = this.calendars.find((_d) => _d.id === id);
    return doctor ? Promise.resolve(doctor) : Promise.resolve(false);
  }

  findAll(): Promise<Calendar[]> {
    return Promise.resolve(this.calendars);
  }

  delete(id: Id): Promise<boolean> {
    if (!this._hasExist(id)) return Promise.resolve(false);

    this.calendars = this.calendars.filter((_d) => _d.id !== id);

    return Promise.resolve(true);
  }
}
