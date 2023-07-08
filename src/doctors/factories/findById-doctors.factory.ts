import { Model } from 'mongoose';
import { FindByIdDoctorUseCase } from '../usecases/findById-doctors.usecase';
import { DoctorDatabaseMongodb } from '../db/doctors.db-mongodb';
import { Doctor } from '../models/doctor.model';

export class FindByIdDoctorFactory {
  static async run(id: string, model: Model<Doctor>) {
    const database = new DoctorDatabaseMongodb(model);
    return await FindByIdDoctorUseCase.execute(id, database);
  }
}
