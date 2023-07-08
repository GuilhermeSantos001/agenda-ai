import { Model } from 'mongoose';
import { UpdateDoctorUseCase } from '../usecases/update-doctors.usecase';
import { DoctorDatabaseMongodb } from '../db/doctors.db-mongodb';
import { Doctor } from '../models/doctor.model';
import { Id } from 'src/common/types/id.type';

export class UpdateDoctorFactory {
  static async run(id: Id, input: Partial<Doctor>, model: Model<Doctor>) {
    const database = new DoctorDatabaseMongodb(model);
    return await UpdateDoctorUseCase.execute(id, input, database);
  }
}
