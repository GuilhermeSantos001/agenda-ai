/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, InputType } from '@nestjs/graphql';
import { Min, Max, IsOptional } from 'class-validator';

@InputType()
export class ScheduleMonthlyInput {
  @Field({ nullable: true })
  @IsOptional()
  @Min(0)
  @Max(23)
  hour: number;

  @Field({ nullable: true })
  @IsOptional()
  @Min(0)
  @Max(59)
  minute: number;

  @Field({ nullable: true })
  @IsOptional()
  @Min(1)
  @Max(31)
  day: number;

  @Field({ nullable: true })
  @IsOptional()
  @Min(1)
  @Max(12)
  month: number;

  @Field({ nullable: true })
  @IsOptional()
  year: number;
}
