import { Model } from 'mongoose';

import { Id } from '../../common/types/id.type';
import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';

export class DoctorDatabaseMongodb extends DatabaseContract<Doctor> {
  constructor(private _model: Model<Doctor>) {
    super();
  }

  async create(data: Doctor): Promise<false | Doctor> {
    try {
      const createdDoctor = new this._model(data);
      return await createdDoctor.save();
    } catch {
      return false;
    }
  }

  async update(id: Id, data: Partial<Doctor>): Promise<false | Doctor> {
    try {
      const updatedDoctor = await this._model.updateOne(
        {
          id,
        },
        {
          $set: {
            ...data,
          },
        },
      );

      return updatedDoctor.modifiedCount > 0
        ? await this._model.findOne({ id })
        : false;
    } catch {
      return false;
    }
  }

  async findOne(id: Id): Promise<false | Doctor> {
    try {
      return await this._model.findOne({ id });
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Doctor[]> {
    return await this._model.find({});
  }

  async delete(id: Id): Promise<boolean> {
    try {
      const result = await this._model.deleteOne({ id });
      return result.deletedCount > 0;
    } catch {
      return false;
    }
  }
}
