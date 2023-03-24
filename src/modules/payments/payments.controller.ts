import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import Stripe from 'stripe';

import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

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
