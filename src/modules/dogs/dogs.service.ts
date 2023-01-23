import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Dog, DogDocument } from './dog.schema';
import { CreateDogDto } from './dto/createDog.dto';

import { UsersService } from '../users/users.service';

import { Role } from '../../enums/role.enum';

@Injectable()
export class DogsService {
  constructor(
    @InjectModel(Dog.name)
    private readonly dogModel: Model<DogDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(createDogDto: CreateDogDto): Promise<Dog> {
    try {
      // Instanciate Dog Model with createDogDto
      const dogToCreate = new this.dogModel(createDogDto);

      // Add dogId in Owner dog list
      await this.usersService.setDog(
        createDogDto.ownerId.toString(),
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

  // TODO: Update not working
  async updateOne(dogId: string, dogChanges: object, user: any): Promise<Dog> {
    try {
      const dog = await this.dogModel.findById(dogId);

      if (
        user.role === Role.CLIENT &&
        user.userId.toString() !== dog.ownerId.toString()
      ) {
        throw new UnauthorizedException();
      }

      return await this.dogModel.findByIdAndUpdate(
        {
          _id: dogId,
        },
        { $set: { ...dogChanges }, $inc: { __v: 1 } },
        { returnOriginal: false },
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else {
        throw new HttpException(
          {
            status: HttpStatus.NOT_MODIFIED,
            error,
          },
          HttpStatus.NOT_MODIFIED,
          {
            cause: error,
          },
        );
      }
    }
  }

  async deleteAll(): Promise<void> {
    const owners = await this.usersService.findAll();
    owners.map(
      async (owner) =>
        await this.usersService.updateOne(owner._id.toString(), { dogs: [] }),
    );

    await this.dogModel.deleteMany();
  }

  async deleteOne(dogId: string): Promise<Dog> {
    try {
      const dog = await this.dogModel.findByIdAndDelete({ _id: dogId });

      await this.usersService.deleteDog(
        dog.ownerId.toString(),
        dog._id.toString(),
      );

      return dog;
    } catch (error) {
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

  async deleteByOwner(ownerId: string): Promise<void> {
    try {
      const dogs: Dog[] = await this.findByOwner(ownerId);

      dogs.map(async (dog) => {
        await this.deleteOne(dog._id.toString());

        await this.usersService.deleteDog(
          dog.ownerId.toString(),
          dog._id.toString(),
        );
      });
    } catch (error) {
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
