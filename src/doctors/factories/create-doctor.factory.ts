import { Model } from 'mongoose';
import { CreateDoctorUseCase } from '../usecases/create-doctor.usecase';
import { DoctorDatabaseMongodb } from '../db/doctors.db-mongodb';
import { Doctor } from '../models/doctor.model';
import { NewDoctorInput } from '../dto/new-doctor.input';

export class CreateDoctorFactory {
  static async run(input: NewDoctorInput, model: Model<Doctor>) {
    const database = new DoctorDatabaseMongodb(model);
    return await CreateDoctorUseCase.execute(input, database);
  }
}
