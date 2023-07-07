import { Model } from 'mongoose';

import { Id } from '../../common/types/id.type';
import { DatabaseContract } from '../../common/contracts/database.contract';
import { Calendar } from '../models/calendar.model';

export class CalendarDatabaseMongodb extends DatabaseContract<Calendar> {
  constructor(private _model: Model<Calendar>) {
    super();
  }

  async create(data: Calendar): Promise<false | Calendar> {
    try {
      const createdCalendar = new this._model(data);
      return await createdCalendar.save();
    } catch {
      return false;
    }
  }

  async update(id: Id, data: Partial<Calendar>): Promise<false | Calendar> {
    try {
      const updatedCalendar = await this._model.updateOne(
        {
          id,
        },
        {
          $set: {
            ...data,
          },
        },
      );

      return updatedCalendar.modifiedCount > 0
        ? await this._model.findOne({ id }).populate({
            path: 'doctor',
            strictPopulate: false,
          })
        : false;
    } catch {
      return false;
    }
  }

  async findOne(id: Id): Promise<false | Calendar> {
    try {
      return await this._model.findOne({ id }).populate({
        path: 'doctor',
        strictPopulate: false,
      });
    } catch {
      return false;
    }
  }

  async findAll(): Promise<Calendar[]> {
    return await this._model.find({}).populate({
      path: 'schedules.doctor',
      strictPopulate: false,
    });
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
