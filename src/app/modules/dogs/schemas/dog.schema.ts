import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';
import { GenderType } from '../../../common/enums/gender.enum';
import { Session } from '../../sessions/schemas/session.schema';

export type DogDocument = HydratedDocument<Dog>;

@Schema()
export class Dog {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  owner: User;

  @Prop({ type: Types.ObjectId, ref: 'Establishment', required: true })
  @ApiProperty({ type: Establishment, required: true })
  establishment: Establishment;

  @Prop({
    type: [{ type: Types.ObjectId, ref: 'Session' }],
    default: [],
  })
  @ApiProperty({ type: [Session], default: [] })
  sessions: [Session];

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  nationalId: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  imageUrl: string;

  @Prop({ type: String, enum: GenderType })
  @ApiProperty({
    enum: GenderType,
    examples: [GenderType.MALE, GenderType.FEMALE],
  })
  gender: GenderType;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  breed: string;

  @Prop()
  @ApiProperty({ type: Date })
  birthDate: Date;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  weight: number;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  height: number;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const DogSchema = SchemaFactory.createForClass(Dog);
