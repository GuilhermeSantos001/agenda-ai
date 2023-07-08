import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Id } from 'src/common/types/id.type';
import { NewDoctorInput } from './dto/new-doctor.input';
import { Doctor } from './models/doctor.model';

import { CreateDoctorFactory } from './factories/create-doctor.factory';
import { UpdateDoctorFactory } from './factories/update-doctors.factory';
import { FindAllDoctorsFactory } from './factories/findAll-doctors.factory';
import { FindByIdDoctorFactory } from './factories/findById-doctors.factory';
import { RemoveDoctorFactory } from './factories/remove-doctors.factory';

@Injectable()
export class DoctorService {
  constructor(@InjectModel(Doctor.name) private doctorModel: Model<Doctor>) {}

  async create(data: NewDoctorInput): Promise<Doctor | Error> {
    return await CreateDoctorFactory.run(data, this.doctorModel);
  }

  async update(id: Id, data: Partial<Doctor>): Promise<Doctor | Error> {
    return await UpdateDoctorFactory.run(id, data, this.doctorModel);
  }

  async findOneById(id: string): Promise<Doctor | Error> {
    return await FindByIdDoctorFactory.run(id, this.doctorModel);
  }

  async findAll(): Promise<Doctor[]> {
    return await FindAllDoctorsFactory.run(this.doctorModel);
  }

  async remove(id: string): Promise<boolean> {
    return await RemoveDoctorFactory.run(id, this.doctorModel);
  }
}
