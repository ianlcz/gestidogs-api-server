import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'Admin',
  EDUCATOR = 'Educator',
  CLIENT = 'Client',
}

@Schema()
export class User {
  @ApiPropertyOptional({ type: String })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  @ApiProperty({ required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  @ApiProperty({ required: true })
  firstname: string;

  @Prop({ type: String, enum: Role, required: true, default: Role.CLIENT })
  @ApiPropertyOptional({
    enum: ['Admin', 'Educator', 'Client'],
    default: Role.CLIENT,
  })
  role: Role;

  @Prop({ type: String, unique: true, required: true })
  @ApiProperty()
  emailAddress: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  password: string;

  @Prop()
  @ApiPropertyOptional()
  avatarUrl: string;

  @Prop({ type: Date, required: true, default: new Date() })
  @ApiPropertyOptional()
  registeredAt: Date;

  @Prop()
  @ApiPropertyOptional()
  lastConnectionAt: Date;

  @Prop()
  @ApiPropertyOptional()
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
