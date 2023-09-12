import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { StatusSessionType } from 'src/app/common/enums/statusSession.enum';

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

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  slot: Date;

  @Prop({
    type: String,
    enum: StatusSessionType,
    required: true,
    default: StatusSessionType.PENDING,
  })
  @ApiProperty({
    enum: StatusSessionType,
    examples: [StatusSessionType.PENDING, StatusSessionType.ONLINE],
    default: StatusSessionType.PENDING,
  })
  status: StatusSessionType;

  @Prop({ type: Boolean, default: false })
  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop({ type: Number })
  @ApiPropertyOptional({ type: Number })
  __v?: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
