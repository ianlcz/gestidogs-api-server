import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { IsEmail, IsNotEmpty, IsPhoneNumber, MinLength } from 'class-validator';

import { RoleType } from 'src/app/common/enums/Role.enum';

import { Activity } from '../../activities/schemas/activity.schema';
import { Dog } from '../../dogs/schemas/dog.schema';

export class CreateUserDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  firstname: string;

  @ApiPropertyOptional({
    type: String,
  })
  avatarUrl?: string;

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

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @ApiPropertyOptional({ type: String })
  @IsPhoneNumber('FR')
  phoneNumber?: string;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ type: Date })
  birthDate?: Date;

  activities?: Activity[];
  dogs?: Dog[];
  registeredAt: Date;
  lastConnectionAt: Date;
  refreshToken: string;
}
