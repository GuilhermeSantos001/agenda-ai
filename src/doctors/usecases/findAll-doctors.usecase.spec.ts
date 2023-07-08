import { DoctorDatabaseMemory } from '../db/doctors.db-memory';
import { CreateDoctorUseCase } from './create-doctor.usecase';
import { FindAllDoctorsUseCase } from './findAll-doctors.usecase';
import { NewDoctorInput } from '../dto/new-doctor.input';

describe('FindAllDoctorsUseCase', () => {
  let database: DoctorDatabaseMemory;

  beforeAll(async () => {
    database = new DoctorDatabaseMemory();
  });

  it('Should be create a valid doctor', async () => {
    const doctor: NewDoctorInput = {
      name: 'John Doe',
      email: 'john@outlook.com',
      documents: {
        rg: '99.999.999-8',
        cpf: '999.999.999-88',
      },
    };

    await expect(
      CreateDoctorUseCase.execute(doctor, database),
    ).resolves.toHaveProperty('created_at');
  });

  it('Should be find all doctors', async () => {
    await expect(FindAllDoctorsUseCase.execute(database)).resolves.toHaveLength(
      1,
    );
  });
});
