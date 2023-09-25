import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { RoleType } from '../../../common/enums/role.enum';

import { Activity } from '../../activities/schemas/activity.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiProperty({ type: String })
  _id: Types.ObjectId | string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  firstname: string;

  @Prop()
  @ApiProperty({ type: String })
  avatarUrl: string;

  @Prop({
    type: String,
    enum: RoleType,
    required: true,
    default: RoleType.CLIENT,
  })
  @ApiProperty({
    enum: RoleType,
    examples: [
      RoleType.ADMINISTRATOR,
      RoleType.MANAGER,
      RoleType.EDUCATOR,
      RoleType.CLIENT,
    ],
    default: RoleType.CLIENT,
  })
  role?: RoleType;

  @Prop({ type: String, lowercase: true, unique: true, required: true })
  @ApiProperty({ type: String, uniqueItems: true, required: true })
  emailAddress: string;

  @Prop({ type: String })
  @ApiProperty({ type: String })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date })
  @ApiProperty({ type: Date })
  birthDate: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Establishment' }], default: [] })
  @ApiProperty({ type: () => [Establishment], default: [] })
  establishments: Establishment[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Activity' }], default: [] })
  @ApiProperty({ type: [Activity], default: [] })
  activities: Activity[];

  @Prop({ type: String, required: false })
  @ApiProperty({ type: String, required: false })
  stripeId: string;

  @Prop({ type: Date, default: new Date() })
  @ApiProperty({ type: Date })
  registeredAt?: Date;

  @Prop()
  @ApiProperty({ type: Date })
  lastConnectionAt: Date;

  @Prop()
  refreshToken: string;

  @Prop({ type: Number })
  @ApiProperty({ type: Number })
  __v?: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
