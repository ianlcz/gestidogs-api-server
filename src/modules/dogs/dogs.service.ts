import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Dog, DogDocument } from './dog.schema';
import { DogDto } from './dto/dog.dto';

import { UsersService } from '../users/users.service';

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
      this.usersService.setDog(
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
}
