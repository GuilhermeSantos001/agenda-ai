import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';
import { DoctorRepository } from '../repos/doctors.repository';
import { Id } from 'src/common/types/id.type';

export class UpdateDoctorUseCase {
  static async execute(
    id: Id,
    input: Partial<Doctor>,
    database: DatabaseContract<Doctor>,
  ) {
    const repository = new DoctorRepository(database);
    return await repository.upgrade(id, input);
  }
}
