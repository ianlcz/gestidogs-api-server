import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { Dog } from '../../dogs/schemas/dog.schema';
import { Activity } from '../../activities/schemas/activity.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  @ApiProperty({ type: Activity, required: true })
  activity: Activity;

  @Prop({ type: Types.ObjectId, ref: 'Dog', required: true })
  @ApiProperty({ type: Dog, required: true })
  dog: Dog;

  @Prop({ type: Boolean, default: false })
  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop({ type: Number })
  @ApiPropertyOptional({ type: Number })
  __v?: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
