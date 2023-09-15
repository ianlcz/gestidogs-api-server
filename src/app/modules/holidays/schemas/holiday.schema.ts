import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';
import { StatusHolidayType } from '../../../common/enums/statusHoliday.enum';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export type HolidayDocument = HydratedDocument<Holiday>;
@Schema()
export class Holiday {
  @ApiProperty({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: User, required: true })
  employee: User;

  @Prop({ type: Types.ObjectId, ref: 'Establishment' })
  @ApiProperty({ type: Establishment })
  establishment: Establishment;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  beginDate: Date;

  @Prop({ type: Date, required: true })
  @ApiProperty({ type: Date, required: true })
  endDate: Date;

  @Prop({
    type: String,
    enum: StatusHolidayType,
    required: true,
    default: StatusHolidayType.PENDING,
  })
  @ApiProperty({
    enum: StatusHolidayType,
    required: true,
    default: StatusHolidayType.PENDING,
  })
  status: StatusHolidayType;

  @Prop({ type: Boolean, default: false })
  @ApiProperty({ type: Boolean, default: false })
  isApproved?: boolean;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const HolidaySchema = SchemaFactory.createForClass(Holiday);
