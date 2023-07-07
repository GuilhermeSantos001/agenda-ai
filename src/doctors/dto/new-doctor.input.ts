/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType()
export class NewDoctorInput {
  @Field()
  name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field(() => JSON)
  documents: {
    rg: string;
    cpf: string;
  };
}
