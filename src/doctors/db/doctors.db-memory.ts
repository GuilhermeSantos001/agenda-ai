import { Id } from '../../common/types/id.type';
import { DatabaseContract } from '../../common/contracts/database.contract';
import { Doctor } from '../models/doctor.model';

export class DoctorDatabaseMemory extends DatabaseContract<Doctor> {
  constructor(private doctors: Doctor[] = []) {
    super();
  }

  private _hasExist(id: Id) {
    return this.doctors.findIndex((_d) => _d.id === id) !== -1;
  }

  create(data: Doctor): Promise<false | Doctor> {
    this.doctors.push(data);
    return Promise.resolve(data);
  }

  update(id: Id, data: Partial<Doctor>): Promise<false | Doctor> {
    const index = this.doctors.findIndex((_d) => _d.id === id);

    if (index === -1) return Promise.resolve(false);

    this.doctors[index] = { ...this.doctors[index], ...data };

    return Promise.resolve(this.doctors[index]);
  }

  findOne(id: Id): Promise<false | Doctor> {
    const doctor = this.doctors.find((_d) => _d.id === id);
    return doctor ? Promise.resolve(doctor) : Promise.resolve(false);
  }

  findAll(): Promise<Doctor[]> {
    return Promise.resolve(this.doctors);
  }

  delete(id: Id): Promise<boolean> {
    if (!this._hasExist(id)) return Promise.resolve(false);

    this.doctors = this.doctors.filter((_d) => _d.id !== id);

    return Promise.resolve(true);
  }
}
