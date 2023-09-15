import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Establishment } from '../../establishments/schemas/establishment.schema';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema()
export class Activity {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Establishment', required: true })
  @ApiProperty({ type: Establishment, required: true })
  establishment: Establishment;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  description: string;

  @Prop()
  @ApiProperty({ type: String })
  imageUrl: string;

  @Prop({ type: String, unique: true, required: true })
  @ApiProperty({ type: String, required: true })
  color: string;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  price: number;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);
