import { Body, Controller, Get, Param, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Request } from 'express';
import Stripe from 'stripe';

import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';

import { CardDto } from './dto/card.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('card')
  async createCard(
    @Req() req: Request,
    @Body() cardDto: CardDto,
  ): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    return await this.paymentsService.createPaymentMethodCard(
      cardDto,
      req.user,
    );
  }

  @Post(':paymentMethodId')
  async createPaymentIntent(
    @Param('paymentMethodId') paymentMethodId: string,
    @Req() req: Request,
    @Body() paymentDto: PaymentDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.paymentsService.createPaymentIntent(
      paymentMethodId,
      req.user,
      paymentDto,
    );
  }

  @Get('users/:stripeId')
  async findPaymentMethodsByStripeId(
    @Param('stripeId') stripeId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
    return await this.paymentsService.findPaymentMethodsByStripeId(stripeId);
  }
}
