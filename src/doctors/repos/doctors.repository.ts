import { Id } from 'src/common/types/id.type';
import { RepositoriesContract } from '../../common/contracts/repositories.contract';
import { Doctor } from '../models/doctor.model';

export class DoctorRepository extends RepositoriesContract<Doctor> {
  async register(data: Doctor): Promise<Doctor | Error> {
    const doctor = await this.database.create(data);

    if (!doctor) throw new Error(`Doctor(${data.name}) not registered!`);

    return doctor;
  }

  async upgrade(id: Id, data: Partial<Doctor>): Promise<Doctor | Error> {
    const doctor = await this.database.update(id, data);

    if (!doctor) throw new Error(`Doctor(${data.name}) not updated!`);

    return doctor;
  }

  async get(id: Id): Promise<Doctor | Error> {
    const doctor = await this.database.findOne(id);

    if (!doctor) throw new Error(`Doctor(${id}) not exists!`);

    return doctor;
  }

  async getAll(): Promise<Doctor[]> {
    return await this.database.findAll();
  }

  async unregister(id: Id): Promise<boolean> {
    return await this.database.delete(id);
  }
}
