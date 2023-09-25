import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class PaymentDto {
  @ApiProperty({ type: Number, required: true })
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  currency: string;
}
