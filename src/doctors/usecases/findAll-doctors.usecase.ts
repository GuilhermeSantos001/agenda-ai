import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';
import { DoctorRepository } from '../repos/doctors.repository';

export class FindAllDoctorsUseCase {
  static async execute(database: DatabaseContract<Doctor>) {
    const repository = new DoctorRepository(database);
    return await repository.getAll();
  }
}
