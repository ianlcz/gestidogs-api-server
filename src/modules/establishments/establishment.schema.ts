import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

export type EstablishmentDocument = HydratedDocument<Establishment>;

@Schema()
export class Establishment {
  @ApiPropertyOptional({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  @ApiProperty({ type: String, required: true })
  ownerId: { type: Types.ObjectId; ref: 'User' };

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  name: string;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  description: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  address: string;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  emailAddress: string;

  @Prop({ type: [Types.ObjectId] })
  @ApiProperty({ type: [String] })
  employees: [{ type: Types.ObjectId; ref: 'User' }];

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

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const EstablishmentSchema = SchemaFactory.createForClass(Establishment);
