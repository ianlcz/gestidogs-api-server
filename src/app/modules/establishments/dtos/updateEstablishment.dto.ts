import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsMongoId, IsOptional, IsPhoneNumber } from 'class-validator';

import { User } from '../../users/schemas/user.schema';

export class UpdateEstablishmentDto {
  @ApiProperty({ type: String })
  @IsMongoId()
  owner: User;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  @IsOptional()
  @IsPhoneNumber('FR')
  phoneNumber: string;

  @ApiProperty({ type: String })
  emailAddress: string;

  @ApiProperty({ type: 'array' })
  employees: User[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'array',
      properties: {
        startTime: { type: 'string' },
        endTime: { type: 'string' },
      },
    },
    default: [],
  })
  @IsArray()
  schedules: [{ startTime: string; endTime: string }][];
}
