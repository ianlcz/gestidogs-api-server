import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

export type ActivityTypeDocument = HydratedDocument<ActivityType>;

@Schema()
export class ActivityType {
  @ApiPropertyOptional({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  @ApiProperty({ type: String, required: true })
  establishmentId: { type: Types.ObjectId; ref: 'Establishment' };

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  title: string;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  description: string;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  duration: number;

  @Prop({ type: Number })
  @ApiPropertyOptional({ type: Number })
  maximumCapacity: number;

  @Prop({ type: Number, required: true })
  @ApiProperty({ type: Number, required: true })
  price: number;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const ActivityTypeSchema = SchemaFactory.createForClass(ActivityType);
