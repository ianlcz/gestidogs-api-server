import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { StatusSessionType } from '../../../common/enums/statusSession.enum';

import { Activity } from '../../activities/schemas/activity.schema';
import { User } from '../../users/schemas/user.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  educator: User;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  @ApiProperty({ type: Activity, required: true })
  activity: Activity;

  @Prop({ type: Types.ObjectId, ref: 'Establishment', required: true })
  @ApiProperty({ type: Establishment, required: true })
  establishment: Establishment;

  @Prop({
    type: String,
    enum: StatusSessionType,
    required: true,
    default: StatusSessionType.PENDING,
  })
  @ApiProperty({
    enum: StatusSessionType,
    required: true,
    default: StatusSessionType.PENDING,
  })
  status: StatusSessionType;

  @Prop({ type: Number, required: true, default: 1 })
  @ApiProperty({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  report: string;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  beginDate: Date;

  @Prop({ type: Date })
  @ApiProperty({ type: Date })
  endDate: Date;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
