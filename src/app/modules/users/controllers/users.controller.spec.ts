import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dtos/createUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getTokens: jest.fn(),
            validateUser: jest.fn(),
            setLastConnectionDate: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            updateOne: jest.fn(),
            deleteOne: jest.fn(),
            register: jest.fn(),
            login: jest.fn(),
            logout: jest.fn(),
            updateRefreshToken: jest.fn(),
            refreshTokens: jest.fn(),
            getInfos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /users/register', () => {
    it('should return a status code of 201 (CREATED) for valid user registration', async () => {
      const newUser: CreateUserDto = {
        lastname: 'Doe',
        firstname: 'John',
        emailAddress: 'john.doe@test.com',
        password: 'testtest',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(newUser);

      expect(response.status).toBe(HttpStatus.CREATED);
    });

    it('should return a status code of 400 (BAD REQUEST) for invalid user registration', async () => {
      const newInvalidUser: CreateUserDto = {
        lastname: '',
        firstname: '',
        emailAddress: 'invalid-email',
        password: 'short',
      };

      const response = await request(app.getHttpServer())
        .post('/users/register')
        .send(newInvalidUser);

      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
