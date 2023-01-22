import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Dog, DogDocument } from './dog.schema';
import { DogDto } from './dto/dog.dto';

import { UsersService } from '../users/users.service';

import { Role } from '../../enums/role.enum';

@Injectable()
export class DogsService {
  constructor(
    @InjectModel(Dog.name)
    private readonly dogModel: Model<DogDocument>,
    private readonly usersService: UsersService,
  ) {}

  async create(dogDto: DogDto): Promise<Dog> {
    try {
      // Instanciate Dog Model with dogDto
      const dogToCreate = new this.dogModel(dogDto);

      // Add dogId in Owner dog list
      await this.usersService.setDog(
        dogDto.ownerId.toString(),
        dogToCreate._id.toString(),
      );

      // Save Dog data on MongoDB and return them
      return await dogToCreate.save();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
        {
          cause: error,
        },
      );
    }
  }

  async findAll(): Promise<Dog[]> {
    return await this.dogModel.find();
  }

  async findOne(dogId: string, user: any): Promise<Dog> {
    try {
      const dog = await this.dogModel.findById(dogId);

      if (
        user.role === Role.CLIENT &&
        user.userId.toString() !== dog.ownerId.toString()
      ) {
        throw new UnauthorizedException();
      }

      return dog;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error,
          },
          HttpStatus.NOT_FOUND,
          {
            cause: error,
          },
        );
      }
    }
  }

  async findByOwner(ownerId: string): Promise<Dog[]> {
    return await this.dogModel.find({ ownerId });
  }
}
