import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';
import { DoctorRepository } from '../repos/doctors.repository';
import { NewDoctorInput } from '../dto/new-doctor.input';

export class CreateDoctorUseCase {
  static async execute(
    input: NewDoctorInput,
    database: DatabaseContract<Doctor>,
  ) {
    const repository = new DoctorRepository(database);
    return await repository.register({
      ...input,
      id: database.generateUUID(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}
