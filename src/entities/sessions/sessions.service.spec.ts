import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { SessionsService } from './sessions.service';
import { ActivitiesService } from '../activities/activities.service';
import { ReservationsService } from '../reservations/reservations.service';

import { Session } from './session.schema';

describe('SessionsService', () => {
  let sessionsService: SessionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SessionsService,
        {
          provide: getModelToken(Session.name),
          useValue: {},
        },
        {
          provide: ActivitiesService,
          useValue: { findOne: jest.fn() },
        },
        {
          provide: ReservationsService,
          useValue: { find: jest.fn() },
        },
      ],
    }).compile();

    sessionsService = module.get<SessionsService>(SessionsService);
  });

  it('should be defined', () => {
    expect(sessionsService).toBeDefined();
  });
});
