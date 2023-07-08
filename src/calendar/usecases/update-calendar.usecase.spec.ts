import { CalendarDatabaseMemory } from '../db/calendar.db-memory';
import { CreateCalendarUseCase } from './create-calendar.usecase';
import { UpdateCalendarUseCase } from './update-calendar.usecase';
import { NewCalendarInput } from '../dto/new-calendar.input';
import { Calendar } from '../models/calendar.model';

describe('UpdateCalendarUseCase', () => {
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

  it('Should be update a calendar', async () => {
    await expect(
      UpdateCalendarUseCase.execute(
        calendar.id,
        {
          hour: 15,
        },
        database,
      ),
    ).resolves.not.toHaveProperty('hour', calendar.hour);
  });

  it('Should not be update a calendar with invalid ID', async () => {
    await expect(
      UpdateCalendarUseCase.execute(
        '???',
        {
          hour: 15,
        },
        database,
      ),
    ).rejects.toThrowError('Calendar not updated!');
  });
});
