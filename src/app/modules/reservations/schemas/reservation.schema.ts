import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Dog } from '../../dogs/schemas/dog.schema';
import { Activity } from '../../activities/schemas/activity.schema';
import { StatusSessionType } from 'src/app/common/enums/statusSession.enum';
import { Session } from '../../sessions/schemas/session.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  @ApiProperty({ type: Activity, required: true })
  activity: Activity;

  @Prop({ type: Types.ObjectId, ref: 'Establishment', required: true })
  @ApiProperty({ type: Establishment, required: true })
  establishment: Establishment;

  @Prop({ type: Types.ObjectId, ref: 'Session' })
  @ApiProperty({ type: Session })
  session: Session;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Dog' }], required: true })
  @ApiProperty({ type: () => [Dog], required: true })
  dogs: Dog[];

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
  @ApiProperty({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
