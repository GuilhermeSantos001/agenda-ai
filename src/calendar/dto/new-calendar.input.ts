/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { Min, Max } from 'class-validator';
import JSON from 'graphql-type-json';

@InputType()
export class NewCalendarInput {
  @Field()
  @Min(0)
  @Max(23)
  hour: number;

  @Field()
  @Min(0)
  @Max(59)
  minute: number;

  @Field()
  @Min(1)
  @Max(31)
  day: number;

  @Field()
  @Min(1)
  @Max(12)
  month: number;

  @Field()
  year: number;

  @Field(() => JSON)
  patient: {
    name: string;
    email: string;
    phone: string;
  };
}
