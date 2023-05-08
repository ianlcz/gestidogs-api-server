import { Test, TestingModule } from '@nestjs/testing';

import { SessionsController } from './sessions.controller';
import { SessionsService } from '../services/sessions.service';

describe('SessionsController', () => {
  let controller: SessionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SessionsController],
      providers: [
        {
          provide: SessionsService,
          useValue: {
            create: jest.fn(),
            writeReport: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByEducator: jest.fn(),
            findEducatorSessionsByDate: jest.fn(),
            findByActivity: jest.fn(),
            findByEstablishment: jest.fn(),
            findPlacesLeft: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            deleteByEducator: jest.fn(),
            deleteByActivity: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SessionsController>(SessionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
