import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { User, UserDocument } from '../../users/schemas/user.schema';

import { PaymentDto } from '../dtos/payment.dto';
import { CardDto } from '../dtos/card.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createPaymentMethodCard(
    cardDto: CardDto,
    user: any,
  ): Promise<Stripe.Response<Stripe.PaymentMethod>> {
    const customer: Stripe.Response<Stripe.Customer> =
      await this.stripe.customers.create({
        name: `${user.firstname} ${user.lastname}`,
        email: user.emailAddress,
        phone: user?.phoneNumber,
      });
    const card: Stripe.Response<Stripe.PaymentMethod> =
      await this.stripe.paymentMethods.create({
        type: 'card',
        card: {
          number: cardDto.number,
          exp_month: cardDto.expMonth,
          exp_year: cardDto.expYear,
          cvc: cardDto.cvc,
        },
      });

    const attachment: Stripe.Response<Stripe.PaymentMethod> =
      await this.stripe.paymentMethods.attach(card.id, {
        customer: customer.id,
      });

    await this.userModel.findOneAndUpdate(
      { _id: user._id },
      { $set: { stripeId: customer.id } },
      { returnOriginal: false },
    );

    return attachment;
  }

  async createPaymentIntent(
    paymentMethodId: string,
    user: any,
    { amount, currency }: PaymentDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Default amount in cents
      currency: currency,
      payment_method: paymentMethodId,
      customer: user.stripeId,
    });

    return await this.stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: paymentMethodId,
    });
  }

  async getClientSecret({
    amount,
    currency,
  }: PaymentDto): Promise<{ clientSecret: string }> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100, // Default amount in cents
      currency,
    });

    return { clientSecret: paymentIntent.client_secret };
  }

  async findPaymentMethodsByStripeId(
    stripeId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
    return await this.stripe.customers.listPaymentMethods(stripeId, {
      type: 'card',
    });
  }
}
