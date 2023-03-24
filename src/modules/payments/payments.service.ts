import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  createPayment({
    amount,
    currency,
  }: PaymentDto): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return this.stripe.paymentIntents.create({
      amount: amount * 100, // Default amount in cents
      currency,
      payment_method_types: ['card'],
    });
  }
}
