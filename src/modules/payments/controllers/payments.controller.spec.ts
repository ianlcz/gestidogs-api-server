import { Test, TestingModule } from '@nestjs/testing';

import { PaymentsController } from './payments.controller';
import { PaymentsService } from '../services/payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            createPaymentMethodCard: jest.fn(),
            createPaymentIntent: jest.fn(),
            findPaymentMethodsByStripeId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
