import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Types } from 'mongoose';

import { User } from '../users/user.schema';

@Schema()
export class Holiday {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  employee: User;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  beginDate: Date;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: Boolean, default: false })
  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
