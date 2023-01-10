import { IsDate, IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { Role } from '../user.schema';

export class CreateUserDto {
  @IsNotEmpty()
  lastname: string;

  @IsNotEmpty()
  firstname: string;

  role: Role;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  @IsDate()
  birthDate: Date;

  avatarUrl: string;
  registeredAt: Date;
  lastConnectionAt: Date;
}
