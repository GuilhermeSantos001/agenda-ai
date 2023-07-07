import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { NewDoctorInput } from './dto/new-doctor.input';
import { Doctor } from './models/doctor.model';

import { CreateDoctorFactory } from './factories/create-doctor.factory';
import { FindAllDoctorsFactory } from './factories/findAll-doctors.factory';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async create(data: NewDoctorInput): Promise<Doctor | Error> {
    return await CreateDoctorFactory.run(data, this.doctorModel);
  }

  async findOneById(id: string): Promise<Doctor> {
    return {} as any;
  }

  async findAll(): Promise<Doctor[]> {
    return await FindAllDoctorsFactory.run(this.doctorModel);
  }

  async remove(id: string): Promise<boolean> {
    return true;
  }
}
