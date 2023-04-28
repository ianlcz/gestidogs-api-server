import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { ActivitiesService } from './activities.service';

import { Activity } from './activity.schema';

describe('ActivitiesService', () => {
  let activitiesService: ActivitiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        ActivitiesService,
        {
          provide: getModelToken(Activity.name),
          useValue: {},
        },
      ],
    }).compile();

    activitiesService = module.get<ActivitiesService>(ActivitiesService);
  });

  it('should be defined', () => {
    expect(activitiesService).toBeDefined();
  });
});
