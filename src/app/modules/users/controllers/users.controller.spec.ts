import { Test, TestingModule } from '@nestjs/testing';

import { RoleType } from '../../../common/enums/role.enum';

import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { User } from '../schemas/user.schema';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

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
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users', () => {
    const mockedUsers: User[] = [
      {
        _id: '60cc452807b1d06248d742e0',
        lastname: 'Doe',
        firstname: 'John',
        role: RoleType.MANAGER,
        emailAddress: 'john.doe@test.com',
        password: 'password-1',
        refreshToken: 'refresh-token-1',
      },
      {
        _id: '61cc452807b1d06248d742e0',
        lastname: 'Smith',
        firstname: 'John',
        role: RoleType.EDUCATOR,
        emailAddress: 'john.smith@test.com',
        password: 'password-2',
        refreshToken: 'refresh-token-2',
      },
      {
        _id: '62cc452807b1d06248d742e0',
        lastname: 'Dupont',
        firstname: 'Jean',
        role: RoleType.EDUCATOR,
        emailAddress: 'jean.dupont@test.com',
        password: 'password-3',
        refreshToken: 'refresh-token-3',
      },
      {
        _id: '63cc452807b1d06248d742e4',
        lastname: 'Carlos',
        firstname: 'Juan',
        role: RoleType.EDUCATOR,
        emailAddress: 'juan.carlos@test.com',
        password: 'password-4',
        refreshToken: 'refresh-token-4',
      },
    ];

    it('should return all users', async () => {
      jest.spyOn(service, 'find').mockImplementation(async () => mockedUsers);

      expect(await controller.find()).toBe(mockedUsers);
    });
  });
});
