import { DoctorDatabaseMemory } from '../db/doctors.db-memory';
import { CreateDoctorUseCase } from './create-doctor.usecase';
import { FindByIdDoctorUseCase } from './findById-doctors.usecase';
import { NewDoctorInput } from '../dto/new-doctor.input';
import { Doctor } from '../models/doctor.model';

describe('FindByIdDoctorUseCase', () => {
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

  it('Should be find a doctor with valid ID', async () => {
    await expect(
      FindByIdDoctorUseCase.execute(doctor.id, database),
    ).resolves.toHaveProperty('created_at');
  });

  it('Should not be find a doctor with invalid ID', async () => {
    await expect(
      FindByIdDoctorUseCase.execute('???', database),
    ).rejects.toThrowError('Doctor(???) not exists!');
  });
});
