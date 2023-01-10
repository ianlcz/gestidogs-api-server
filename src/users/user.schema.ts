import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

export enum Role {
  ADMIN = 'Admin',
  EDUCATOR = 'Educator',
  CLIENT = 'Client',
}

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop({ type: String, uppercase: true, required: true })
  lastname: string;

  @Prop({ type: String, required: true })
  firstname: string;

  @Prop({ type: String, enum: Role, required: true, default: Role.CLIENT })
  role: string;

  @Prop({ type: String, required: true })
  emailAddress: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop()
  avatarUrl: string;

  @Prop({ type: Date, required: true })
  birthDate: Date;

  @Prop({ type: Date, required: true, default: new Date() })
  registeredAt: Date;

  @Prop()
  lastConnectionAt: Date;

  @Prop()
  __v: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
