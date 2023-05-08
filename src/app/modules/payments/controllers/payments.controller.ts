import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Request } from 'express';
import Stripe from 'stripe';

import { Roles } from 'app/common/decorators/roles.decorator';
import { RoleType } from 'app/common/enums/Role.enum';
import { RolesGuard } from 'app/common/guards/roles.guard';
import { AccessTokenGuard } from 'app/common/guards/accessToken.guard';

import { PaymentsService } from '../services/payments.service';
import { PaymentDto } from '../dtos/payment.dto';

import { CardDto } from '../dtos/card.dto';

@ApiBearerAuth('BearerToken')
@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Roles(RoleType.CLIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Make a payment intent' })
  @ApiCreatedResponse({
    description: 'Payment intent successfully done',
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized because only **Clients** can do a payment intent',
  })
  @ApiQuery({
    name: 'paymentMethodId',
    type: String,
    required: true,
  })
  @Post()
  async createPaymentIntent(
    @Query('paymentMethodId') paymentMethodId: string,
    @Req() req: Request,
    @Body() paymentDto: PaymentDto,
  ): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    return await this.paymentsService.createPaymentIntent(
      paymentMethodId,
      req.user,
      paymentDto,
    );
  }

  @Roles(RoleType.CLIENT)
  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: "Find all user's payment methods" })
  @ApiOkResponse({
    description: "List of user's payment methods",
  })
  @ApiUnauthorizedResponse({
    description:
      'Unauthorized because only **Administrators** and **Managers** can find all user payment methods',
  })
  @ApiQuery({
    name: 'stripeId',
    type: String,
    required: true,
  })
  @Get()
  async findPaymentMethodsByStripeId(
    @Param('stripeId') stripeId: string,
  ): Promise<Stripe.Response<Stripe.ApiList<Stripe.PaymentMethod>>> {
    return await this.paymentsService.findPaymentMethodsByStripeId(stripeId);
  }
}
