import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty } from 'class-validator';

export class WriteReportDto {
  @ApiProperty({ type: String, required: true })
  @IsNotEmpty()
  report: string;
}
