import { CalendarDatabaseMemory } from '../db/calendar.db-memory';
import { CreateCalendarUseCase } from './create-calendar.usecase';
import { RemoveCalendarUseCase } from './remove-calendars.usecase';
import { NewCalendarInput } from '../dto/new-calendar.input';
import { Calendar } from '../models/calendar.model';

describe('RemoveCalendarUseCase', () => {
  let database: CalendarDatabaseMemory;
  let calendar: Calendar;

  beforeAll(async () => {
    database = new CalendarDatabaseMemory();
  });

  it('Should be create a valid calendar', async () => {
    const data: NewCalendarInput = {
      hour: 9,
      minute: 0,
      day: 7,
      month: 7,
      year: 2023,
      patient: {
        name: 'John Doe',
        email: 'john@outlook.com',
        phone: '5511999999999',
      },
    };

    calendar = (await CreateCalendarUseCase.execute(
      data,
      database,
    )) as Calendar;

    expect(calendar).toHaveProperty('patient.email', 'john@outlook.com');
  });

  it('Should be remove calendar', async () => {
    await expect(
      RemoveCalendarUseCase.execute(calendar.id, database),
    ).resolves.toBe(true);
  });

  it('Should not be remove a calendar with invalid ID', async () => {
    await expect(RemoveCalendarUseCase.execute('???', database)).resolves.toBe(
      false,
    );
  });
});
