import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}
