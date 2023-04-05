import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import Stripe from 'stripe';

import { PaymentsService } from './payments.service';
import { PaymentDto } from './dto/payment.dto';

import { CardDto } from './dto/card.dto';
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
  @ApiOperation({ summary: 'Add card as payment method' })
  @ApiCreatedResponse({
    description: 'Card payment method successfully added',
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized because only **Clients** can add their card as payment method',
  })
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

  @UseGuards(AccessTokenGuard)
  @Roles(Role.CLIENT)
  @ApiOperation({ summary: 'Make a payment intent' })
  @ApiCreatedResponse({
    description: 'Payment intent successfully done',
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized because only **Clients** can do a payment intent',
  })
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

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: "Find all user's payment methods" })
  @ApiOkResponse({
    description: "List of user's payment methods",
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized because only **Administrators** and **Managers** can find all user payment methods',
  })
  @Get('users/:stripeId')
  async findPaymentMethodsByStripeId(
    @Param('stripeId') stripeId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
    return await this.paymentsService.findPaymentMethodsByStripeId(stripeId);
  }
}
