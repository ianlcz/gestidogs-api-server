import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { DogsService } from './dogs.service';

import { Dog } from '../schemas/dog.schema';

describe('DogsService', () => {
  let dogsService: DogsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DogsService,
        {
          provide: getModelToken(Dog.name),
          useValue: {},
        },
      ],
    }).compile();

    dogsService = module.get<DogsService>(DogsService);
  });

  it('should be defined', () => {
    expect(dogsService).toBeDefined();
  });
});
