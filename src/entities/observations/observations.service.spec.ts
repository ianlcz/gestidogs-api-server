import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ObservationsService } from './observations.service';

import { Observation } from './observation.schema';

describe('ObservationsService', () => {
  let observationsService: ObservationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ObservationsService,
        {
          provide: getModelToken(Observation.name),
          useValue: {},
        },
      ],
    }).compile();

    observationsService = module.get<ObservationsService>(ObservationsService);
  });

  it('should be defined', () => {
    expect(observationsService).toBeDefined();
  });
});
