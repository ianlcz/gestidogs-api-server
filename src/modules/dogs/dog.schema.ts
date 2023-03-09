import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

export type DogDocument = HydratedDocument<Dog>;

@Schema()
export class Dog {
  @ApiPropertyOptional({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  @ApiProperty({ type: String, required: true })
  ownerId: { type: Types.ObjectId; ref: 'User' };

  @Prop({ type: Types.ObjectId, required: true })
  @ApiProperty({ type: String, required: true })
  establishmentId: { type: Types.ObjectId; ref: 'Establishment' };

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
