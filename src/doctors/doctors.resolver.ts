/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'mercurius';

import { NewDoctorInput } from './dto/new-doctor.input';
import { Doctor } from './models/doctor.model';
import { DoctorService } from './doctors.service';

@Resolver((of) => Doctor)
export class DoctorResolver {
  constructor(private readonly doctorService: DoctorService) {}

  @Query((returns) => Doctor)
  async doctor(@Args('id') id: string): Promise<Doctor> {
    const doctor = await this.doctorService.findOneById(id);
    if (doctor) {
      throw new NotFoundException(`Doctor with id(${id}) not exists!`);
    }
    return doctor;
  }

  @Query((returns) => [Doctor])
  async doctors(): Promise<Doctor[]> {
    return await this.doctorService.findAll();
  }

  @Mutation((returns) => Doctor)
  async addDoctor(
    @Args('newDoctorData') newDoctorData: NewDoctorInput,
    @Context('pubsub') pubSub: PubSub,
  ): Promise<Doctor> {
    const doctor = await this.doctorService.create(newDoctorData);

    if (doctor instanceof Error) throw new InternalServerErrorException(doctor);

    pubSub.publish({ topic: 'doctorAdded', payload: { doctorAdded: doctor } });

    return doctor;
  }

  @Mutation((returns) => Boolean)
  async removeDoctor(@Args('id') id: string) {
    return this.doctorService.remove(id);
  }

  @Subscription((returns) => Doctor)
  doctorAdded(@Context('pubsub') pubSub: PubSub) {
    return pubSub.subscribe('doctorAdded');
  }
}
