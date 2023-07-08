import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';
import { DoctorRepository } from '../repos/doctors.repository';

export class FindByIdDoctorUseCase {
  static async execute(id: string, database: DatabaseContract<Doctor>) {
    const repository = new DoctorRepository(database);
    return await repository.get(id);
  }
}
