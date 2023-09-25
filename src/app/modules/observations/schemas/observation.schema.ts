import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Dog } from '../../dogs/schemas/dog.schema';

export type ObservationDocument = HydratedDocument<Observation>;

@Schema()
export class Observation {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Dog', required: true })
  @ApiProperty({ type: Dog, required: true })
  dog: Dog;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  description: string;

  @Prop({ type: Date, required: true, default: new Date() })
  @ApiProperty({ type: Date, required: true, default: new Date() })
  createdAt: Date;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const ObservationSchema = SchemaFactory.createForClass(Observation);
