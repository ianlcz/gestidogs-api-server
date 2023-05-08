import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { RoleType } from '../../../enums/Role.enum';

import { Activity } from '../../activities/schemas/activity.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, required: true })
  firstname: string;

  @Prop()
  @ApiPropertyOptional({ type: String })
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
  role: RoleType;

  @Prop({ type: String, lowercase: true, unique: true, required: true })
  @ApiProperty({ type: String, uniqueItems: true, required: true })
  emailAddress: string;

  @Prop({ type: String })
  @ApiPropertyOptional({ type: String })
  phoneNumber: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date })
  @ApiPropertyOptional({ type: Date })
  birthDate?: Date;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Activity' }], default: [] })
  @ApiPropertyOptional({ type: [Activity], default: [] })
  activities: Activity[];

  @Prop({ type: String, required: false })
  @ApiPropertyOptional({ type: String, required: false })
  stripeId?: string;

  @Prop({ type: Date, default: new Date() })
  @ApiProperty({ type: Date })
  registeredAt: Date;

  @Prop()
  @ApiPropertyOptional({ type: Date })
  lastConnectionAt: Date;

  @Prop()
  refreshToken: string;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
