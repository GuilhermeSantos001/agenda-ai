import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DoctorResolver } from './doctors.resolver';
import { DoctorService } from './doctors.service';
import { Doctor, DoctorSchema } from './models/doctor.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Doctor.name, schema: DoctorSchema }]),
  ],
  providers: [DoctorResolver, DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
