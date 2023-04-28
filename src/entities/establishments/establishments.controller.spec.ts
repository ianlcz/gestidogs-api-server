import { Test, TestingModule } from '@nestjs/testing';
import { EstablishmentsController } from './establishments.controller';
import { EstablishmentsService } from './establishments.service';

describe('EstablishmentsController', () => {
  let controller: EstablishmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstablishmentsController],
      providers: [
        {
          provide: EstablishmentsService,
          useValue: {
            create: jest.fn(),
            addEmployee: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            deleteByOwner: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EstablishmentsController>(EstablishmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
