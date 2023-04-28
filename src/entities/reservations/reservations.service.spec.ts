import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ReservationsService } from './reservations.service';
import { SessionsService } from '../sessions/sessions.service';

import { Reservation } from './reservation.schema';

describe('ReservationsService', () => {
  let reservationsService: ReservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getModelToken(Reservation.name),
          useValue: {},
        },
        {
          provide: SessionsService,
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    reservationsService = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(reservationsService).toBeDefined();
  });
});
