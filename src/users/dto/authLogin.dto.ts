import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  password: string;
}
