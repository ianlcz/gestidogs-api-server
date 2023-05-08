import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { Dog } from '../../dogs/schemas/dog.schema';
import { Session } from '../../sessions/schemas/session.schema';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema()
export class Reservation {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Session', required: true })
  @ApiProperty({ type: Session, required: true })
  session: Session;

  @Prop({ type: Types.ObjectId, ref: 'Dog', required: true })
  @ApiProperty({ type: Dog, required: true })
  dog: Dog;

  @Prop({ type: Boolean, default: false })
  @ApiPropertyOptional({ type: Boolean, default: false })
  isApproved: boolean;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
