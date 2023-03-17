import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { User } from '../users/user.schema';
import { Establishment } from '../establishments/establishment.schema';

export type DogDocument = HydratedDocument<Dog>;

@Schema()
export class Dog {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  owner: User;

  @Prop({ type: Types.ObjectId, ref: 'Establishment', required: true })
  @ApiProperty({ type: Establishment, required: true })
  establishment: Establishment;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  nationalId: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  breed: string;

  @Prop()
  @ApiPropertyOptional({ type: Date })
  birthDate: Date;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  weight: number;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  height: number;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const DogSchema = SchemaFactory.createForClass(Dog);