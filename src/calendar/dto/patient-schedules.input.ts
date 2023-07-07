/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType()
export class PatientSchedulesInput {
  @Field({ nullable: true })
  @IsOptional()
  doctor: string;

  @Field(() => JSON, { nullable: true })
  @IsOptional()
  patient: {
    name: string;
    email: string;
    phone: string;
  };
}
