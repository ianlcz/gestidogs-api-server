import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

import { User, UserDocument } from '../users/user.schema';

import { PaymentDto } from './dto/payment.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    this.stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: '2022-11-15',
    });
  }

  async createCustomer(
    userLogged: any,
  ): Promise<Stripe.Response<Stripe.Customer>> {
    const customer = await this.stripe.customers.create({
      name: `${userLogged.firstname} ${userLogged.lastname}`,
      email: userLogged.emailAddress,
      phone: userLogged.phoneNumber,
    });

    await this.userModel.findByIdAndUpdate(userLogged._id, {
      $set: { stripeId: customer.id },
    });

    return customer;
  }

  async createPayment(
    { number, expMonth, expYear, cvc, amount, currency }: PaymentDto,
    userLogged: any,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const paymentMethod = await this.stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: number,
        exp_month: expMonth,
        exp_year: expYear,
        cvc: cvc,
      },
    });

    const { stripeId } = await this.userModel.findById(userLogged.sub);

    return this.stripe.paymentIntents.create({
      amount: amount * 100, // Default amount in cents
      currency: currency,
      payment_method: paymentMethod.id,
      customer: stripeId,
    });
  }
}
