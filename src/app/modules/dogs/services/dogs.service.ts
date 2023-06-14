import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { response } from 'express';

import { Dog, DogDocument } from '../schemas/dog.schema';
import { CreateDogDto } from '../dtos/createDog.dto';

import { RoleType } from '../../../common/enums/role.enum';

@Injectable()
export class DogsService {
  constructor(
    @InjectModel(Dog.name)
    private readonly dogModel: Model<DogDocument>,
  ) {}

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    try {
      // Instanciate Dog Model with createDogDto
      const dogToCreate = new this.dogModel(createDogDto);

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

  async find(ownerId?: string, establishmentId?: string): Promise<Dog[]> {
    return await this.dogModel
      .find({
        ...(ownerId && { owner: ownerId }),
        ...(establishmentId && { establishment: establishmentId }),
      })
      .populate([
        {
          path: 'owner',
          model: 'User',
        },
        {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      ]);
  }

  async findOne(dogId: string, user: any): Promise<Dog> {
    try {
      const dog = await this.dogModel.findById(dogId).populate([
        {
          path: 'owner',
          model: 'User',
        },
        {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      ]);

      if (!dog) {
        throw new NotFoundException('Dog not found');
      }

      if (user && user.role === RoleType.CLIENT && user._id !== dog.owner._id) {
        throw new UnauthorizedException();
      }

      return dog;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('Dog not found.');
        throw error;
      } else {
        console.error('An error occurred:', error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }

  async updateOne(dogId: string, dogChanges: object, user: any): Promise<Dog> {
    try {
      const dog: Dog = await this.dogModel.findById(dogId).populate([
        {
          path: 'owner',
          model: 'User',
        },
        {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      ]);

      if (!dog) {
        throw new NotFoundException('Dog not found');
      }

      if (user.role === RoleType.CLIENT && user._id !== dog.owner._id) {
        throw new UnauthorizedException();
      }

      const dogToModify: Dog = await this.dogModel
        .findOneAndUpdate(
          {
            _id: dogId,
          },
          { $set: { ...dogChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate([
          {
            path: 'owner',
            model: 'User',
          },
          {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        ]);

      if (!dogToModify) {
        throw new NotFoundException('Dog to modify not found');
      }

      return dogToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Dog to modify not found.');
        throw error;
      } else {
        console.error('An error occurred:', error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }

  async deleteOne(dogId: string): Promise<Dog> {
    try {
      const dogToDelete = await this.dogModel
        .findOneAndDelete({ _id: dogId })
        .populate([
          {
            path: 'owner',
            model: 'User',
          },
          {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        ]);

      if (!dogToDelete) {
        throw new NotFoundException('Dog to delete not found');
      }

      return dogToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Dog to delete not found.');
        throw error;
      } else {
        console.error('An error occurred:', error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }

  async deleteByOwner(ownerId: string): Promise<Dog[]> {
    try {
      const dogs: Dog[] = await this.dogModel.find({ owner: ownerId });

      dogs.forEach(async (dog) => await this.deleteOne(dog._id.toString()));

      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Delete dogs successfully',
      });

      return dogs;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Dogs to delete not found.');
        throw error;
      } else {
        console.error('An error occurred:', error);
        throw new HttpException(
          {
            status: HttpStatus.BAD_REQUEST,
            error,
          },
          HttpStatus.BAD_REQUEST,
          {
            cause: error,
          },
        );
      }
    }
  }
}
