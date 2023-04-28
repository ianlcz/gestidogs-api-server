import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';

import { HolidaysService } from './holidays.service';

import { Holiday } from './holiday.schema';

describe('HolidaysService', () => {
  let holidaysService: HolidaysService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HolidaysService,
        {
          provide: getModelToken(Holiday.name),
          useValue: {},
        },
      ],
    }).compile();

    holidaysService = module.get<HolidaysService>(HolidaysService);
  });

  it('should be defined', () => {
    expect(holidaysService).toBeDefined();
  });
});
