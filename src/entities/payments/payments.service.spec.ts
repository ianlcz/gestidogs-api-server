import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { PaymentsService } from './payments.service';

import { User } from '../users/user.schema';

describe('PaymentsService', () => {
  let paymentsServices: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken(User.name),
          useValue: {},
        },
      ],
    }).compile();

    paymentsServices = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(paymentsServices).toBeDefined();
  });
});
