import { Test, TestingModule } from '@nestjs/testing';

import { HolidaysController } from './holidays.controller';
import { HolidaysService } from '../services/holidays.service';

describe('HolidaysController', () => {
  let controller: HolidaysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HolidaysController],
      providers: [
        {
          provide: HolidaysService,
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

    controller = module.get<HolidaysController>(HolidaysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
