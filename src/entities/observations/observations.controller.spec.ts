import { Test, TestingModule } from '@nestjs/testing';

import { ObservationsController } from './observations.controller';
import { ObservationsService } from './observations.service';

describe('ObservationsController', () => {
  let controller: ObservationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ObservationsController],
      providers: [
        {
          provide: ObservationsService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ObservationsController>(ObservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
