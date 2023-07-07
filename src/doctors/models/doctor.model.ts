/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ID, ObjectType } from '@nestjs/graphql';
import JSON from 'graphql-type-json';

import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Id } from 'src/common/types/id.type';
import { Documents } from '../types/documents.type';

export type DoctorDocument = HydratedDocument<Doctor>;

@ObjectType({ description: 'doctor' })
@Schema({
  collection: 'doctor',
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
})
export class Doctor {
  @Field((type) => ID)
  @Prop()
  id: Id;

  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop({
    unique: true,
    trim: true,
    lowercase: true,
    required: [true, 'Email address is required'],
    validate: [
      function (email) {
        const match = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return match.test(email);
      },
      'Please fill a valid email address',
    ],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
  })
  email: string;

  @Field(() => JSON)
  @Prop(
    raw({
      rg: { type: String, unique: true },
      cpf: { type: String, unique: true },
    }),
  )
  documents: Documents;

  @Field()
  @Prop()
  created_at: Date;

  @Field()
  @Prop()
  updated_at: Date;
}

export const DoctorSchema = SchemaFactory.createForClass(Doctor);
