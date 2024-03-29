import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { User } from '../../users/schemas/user.schema';

export type EstablishmentDocument = HydratedDocument<Establishment>;

@Schema()
export class Establishment {
  @ApiProperty({ type: String })
  _id: Types.ObjectId | string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  @ApiProperty({ type: () => User, required: true })
  owner: User;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  address: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  emailAddress: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @ApiProperty({ type: () => [User] })
  employees: User[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  @ApiProperty({ type: () => [User] })
  clients: User[];

  @Prop({
    type: [[{ startTime: String, endTime: String }]],
    default: [],
  })
  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      properties: {
        startTime: { type: 'string' },
        endTime: { type: 'string' },
      },
    },
    default: [],
  })
  schedules: [{ startTime: string; endTime: string }][];

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const EstablishmentSchema = SchemaFactory.createForClass(Establishment);
