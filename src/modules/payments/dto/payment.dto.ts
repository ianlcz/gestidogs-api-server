import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  number: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  expMonth: number;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  expYear: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  cvc: string;

  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  currency: string;
}
