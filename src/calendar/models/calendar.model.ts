/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

import { Id } from 'src/common/types/id.type';
import { Doctor } from '../../doctors/models/doctor.model';
import { Schedules } from '../types/schedules.type';

export type CalendarDocument = HydratedDocument<Calendar>;

@ObjectType({ description: 'calendar' })
@Schema({
  collection: 'calendar',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Calendar {
  @Field((type) => ID)
  @Prop()
  id: Id;

  @Field()
  @Prop({ min: 0, max: 23 })
  hour: number;

  @Field()
  @Prop({ min: 0, max: 59 })
  minute: number;

  @Field()
  @Prop({ min: 1, max: 31 })
  day: number;

  @Field()
  @Prop({ min: 1, max: 12 })
  month: number;

  @Field()
  @Prop()
  year: number;

  @Field()
  @Prop()
  timestamp: number;

  @Field(() => JSON)
  @Prop({
    type: [
      {
        doctor: { type: Types.ObjectId, ref: Doctor.name },
        patient: {
          type: {
            name: { type: String },
            email: { type: String },
            phone: { type: String },
          },
        },
      },
    ],
  })
  schedules: Schedules[];

  @Field()
  @Prop()
  created_at: Date;

  @Field()
  @Prop()
  updated_at: Date;
}

export const CalendarSchema = SchemaFactory.createForClass(Calendar);
