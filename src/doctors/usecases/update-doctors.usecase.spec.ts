import { DoctorDatabaseMemory } from '../db/doctors.db-memory';
import { CreateDoctorUseCase } from './create-doctor.usecase';
import { UpdateDoctorUseCase } from './update-doctors.usecase';
import { NewDoctorInput } from '../dto/new-doctor.input';
import { Doctor } from '../models/doctor.model';

describe('UpdateDoctorUseCase', () => {
  let database: DoctorDatabaseMemory;
  let doctor: Doctor;

  beforeAll(async () => {
    database = new DoctorDatabaseMemory();
  });

  it('Should be create a valid doctor', async () => {
    const data: NewDoctorInput = {
      name: 'John Doe',
      email: 'john@outlook.com',
      documents: {
        rg: '99.999.999-8',
        cpf: '999.999.999-88',
      },
    };

    doctor = (await CreateDoctorUseCase.execute(data, database)) as Doctor;

    expect(doctor).toHaveProperty('created_at');
  });

  it('Should be update a doctor', async () => {
    await expect(
      UpdateDoctorUseCase.execute(
        doctor.id,
        {
          email: 'john@gmail.com',
        },
        database,
      ),
    ).resolves.not.toHaveProperty('email', doctor.email);
  });

  it('Should not be update a doctor with invalid ID', async () => {
    await expect(
      UpdateDoctorUseCase.execute(
        '???',
        {
          email: 'john@gmail.com',
        },
        database,
      ),
    ).rejects.toThrowError('Doctor(undefined) not updated!');
  });
});
