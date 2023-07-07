import { Doctor } from '../../doctors/models/doctor.model';

export type Schedules = {
  doctor: Doctor;
  patient: {
    name: string;
    email: string;
    phone: string;
  };
};
