import { Test, TestingModule } from '@nestjs/testing';

import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from '../services/activities.service';

describe('ActivitiesController', () => {
  let activitiesController: ActivitiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
          },
        },
      ],
    }).compile();

    activitiesController =
      module.get<ActivitiesController>(ActivitiesController);
  });

  it('should be defined', () => {
    expect(activitiesController).toBeDefined();
  });
});
