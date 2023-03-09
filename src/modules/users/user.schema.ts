import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { HydratedDocument, Types } from 'mongoose';

import { Role } from '../../enums/role.enum';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @ApiPropertyOptional({ type: String })
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

  @Prop({ type: String, enum: Role, required: true, default: Role.CLIENT })
  @ApiProperty({ enum: Role, default: Role.CLIENT })
  role: Role;

  @Prop({ type: String, lowercase: true, unique: true, required: true })
  @ApiProperty({ type: String, uniqueItems: true, required: true })
  emailAddress: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: Date })
  @ApiPropertyOptional({ type: Date })
  birthDate: Date;

  @Prop({ type: [String], default: [] })
  @ApiPropertyOptional({ type: [String], default: [] })
  activities: [Types.ObjectId];

  @Prop({ type: [String], default: [] })
  @ApiPropertyOptional({ type: [String], default: [] })
  dogs: [Types.ObjectId];

  @Prop({ type: Date, default: new Date() })
  @ApiProperty({ type: Date })
  registeredAt: Date;

  @Prop()
  @ApiPropertyOptional({ type: Date })
  lastConnectionAt: Date;

  @Prop()
  @ApiPropertyOptional({ type: Number })
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
