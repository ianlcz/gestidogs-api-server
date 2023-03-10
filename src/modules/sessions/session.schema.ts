import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Status } from '../../enums/status.enum';

import { Activity } from '../activities/activity.schema';
import { User } from '../users/user.schema';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
export class Session {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  educator: User;

  @Prop({ type: Types.ObjectId, ref: 'Activity', required: true })
  @ApiProperty({ type: Activity, required: true })
  activity: Activity;

  @Prop({ type: String, enum: Status, required: true, default: Status.PENDING })
  @ApiProperty({ enum: Status, required: true, default: Status.PENDING })
  status: Status;

  @Prop({ type: Number, required: true, default: 1 })
  @ApiProperty({ type: Number, required: true, default: 1 })
  maximumCapacity: number;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  report: string;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  beginDate: Date;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  endDate: Date;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);
