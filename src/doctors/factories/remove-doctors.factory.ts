import { Model } from 'mongoose';
import { RemoveDoctorUseCase } from '../usecases/remove-doctors.usecase';
import { DoctorDatabaseMongodb } from '../db/doctors.db-mongodb';
import { Doctor } from '../models/doctor.model';

export class RemoveDoctorFactory {
  static async run(id: string, model: Model<Doctor>) {
    const database = new DoctorDatabaseMongodb(model);
    return await RemoveDoctorUseCase.execute(id, database);
  }
}
