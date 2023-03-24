import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';
import Stripe from 'stripe';

import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';

import { AccessTokenGuard } from '../../guards/accessToken.guard';
import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Create a Payment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Payment successfully created',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized because only **Client** can create a Payment',
  })
  @ApiResponse({
    status: HttpStatus.BAD_GATEWAY,
    description: 'Bad Request',
  })
  @Post()
  createPayments(@Res() response: Response, @Body() paymentDto: PaymentDto) {
    this.paymentsService
      .createPayment(paymentDto)
      .then((res: Stripe.Response<Stripe.PaymentIntent>) => {
        response.status(HttpStatus.CREATED).json(res.client_secret);
      })
      .catch((err: Error) => {
        response.status(HttpStatus.BAD_REQUEST).json(err);
      });
  }
}
