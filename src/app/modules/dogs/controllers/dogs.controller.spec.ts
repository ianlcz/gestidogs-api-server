import { Test, TestingModule } from '@nestjs/testing';

import { DogsController } from './dogs.controller';
import { DogsService } from '../services/dogs.service';

describe('DogsController', () => {
  let controller: DogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DogsController],
      providers: [
        {
          provide: DogsService,
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            deleteByOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DogsController>(DogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
