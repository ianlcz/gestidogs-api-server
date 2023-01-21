import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Dog, DogDocument } from './dog.schema';
import { DogDto } from './dto/dog.dto';

@Injectable()
export class DogsService {
  constructor(
    @InjectModel(Dog.name)
    private readonly dogModel: Model<DogDocument>,
  ) {}

  async create(dogDto: DogDto): Promise<Dog> {
    try {
      // Instanciate Dog Model with dogDto
      const dogToCreate = new this.dogModel(dogDto);

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
