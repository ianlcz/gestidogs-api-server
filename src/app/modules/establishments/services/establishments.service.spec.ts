import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { EstablishmentsService } from './establishments.service';
import { UsersService } from '../../users/services/users.service';

import { Establishment } from '../schemas/establishment.schema';

describe('EstablishmentsService', () => {
  let establishmentsService: EstablishmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EstablishmentsService,
        {
          provide: getModelToken(Establishment.name),
          useValue: {},
        },
        {
          provide: UsersService,
          useValue: { register: jest.fn() },
        },
      ],
    }).compile();

    establishmentsService = module.get<EstablishmentsService>(
      EstablishmentsService,
    );
  });

  it('should be defined', () => {
    expect(establishmentsService).toBeDefined();
  });
});
