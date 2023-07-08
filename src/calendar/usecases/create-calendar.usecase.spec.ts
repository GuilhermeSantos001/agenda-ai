import { CalendarDatabaseMemory } from '../db/calendar.db-memory';
import { CreateCalendarUseCase } from './create-calendar.usecase';
import { NewCalendarInput } from '../dto/new-calendar.input';

describe('CreateCalendarUseCase', () => {
  let database: CalendarDatabaseMemory;

  beforeAll(async () => {
    database = new CalendarDatabaseMemory();
  });

  it('Should be create a valid calendar', async () => {
    const calendar: NewCalendarInput = {
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

    await expect(
      CreateCalendarUseCase.execute(calendar, database),
    ).resolves.toHaveProperty('patient.email', 'john@outlook.com');
  });
});
