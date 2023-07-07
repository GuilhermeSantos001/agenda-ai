import { Model } from 'mongoose';
import { FindAllDoctorsUseCase } from '../usecases/findAll-doctors.usecase';
import { DoctorDatabaseMongodb } from '../db/doctors.db-mongodb';
import { Doctor } from '../models/doctor.model';

export class FindAllDoctorsFactory {
  static async run(model: Model<Doctor>) {
    const database = new DoctorDatabaseMongodb(model);
    return await FindAllDoctorsUseCase.execute(database);
  }
}
