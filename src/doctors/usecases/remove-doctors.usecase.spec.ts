import { DoctorDatabaseMemory } from '../db/doctors.db-memory';
import { CreateDoctorUseCase } from './create-doctor.usecase';
import { RemoveDoctorUseCase } from './remove-doctors.usecase';
import { NewDoctorInput } from '../dto/new-doctor.input';
import { Doctor } from '../models/doctor.model';

describe('RemoveDoctorUseCase', () => {
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

  it('Should be remove a doctor with valid ID', async () => {
    await expect(
      RemoveDoctorUseCase.execute(doctor.id, database),
    ).resolves.toBe(true);
  });

  it('Should not be remove a doctor with invalid ID', async () => {
    await expect(RemoveDoctorUseCase.execute('???', database)).resolves.toBe(
      false,
    );
  });
});
