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
    return await this.dogModel.find().populate([
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
          populate: {
            path: 'dogs',
            model: 'Dog',
            populate: {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          },
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

      if (user.role === Role.CLIENT && user._id !== dog.owner._id) {
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
    return await this.dogModel.find({ ownerId }).populate([
      {
        path: 'owner',
        model: 'User',
        populate: {
          path: 'dogs',
          model: 'Dog',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
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

  async findByEstablishment(establishmentId: string): Promise<Dog[]> {
    return await this.dogModel.find({ establishmentId }).populate([
      {
        path: 'owner',
        model: 'User',
        populate: {
          path: 'dogs',
          model: 'Dog',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
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

  async updateOne(dogId: string, dogChanges: object, user: any): Promise<Dog> {
    try {
      const dog = await this.dogModel.findById(dogId).populate([
        {
          path: 'owner',
          model: 'User',
          populate: {
            path: 'dogs',
            model: 'Dog',
            populate: {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          },
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

      if (user.role === Role.CLIENT && user._id !== dog.owner._id) {
        throw new UnauthorizedException();
      }

      return await this.dogModel
        .findByIdAndUpdate(
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
            populate: {
              path: 'dogs',
              model: 'Dog',
              populate: {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
            },
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
        await this.usersService.updateOne(owner._id.toString(), {
          ...owner,
          dogs: [],
        }),
    );

    await this.dogModel.deleteMany();
  }

  async deleteOne(dogId: string): Promise<Dog> {
    try {
      const dog = await this.dogModel
        .findByIdAndDelete({ _id: dogId })
        .populate([
          {
            path: 'owner',
            model: 'User',
            populate: {
              path: 'dogs',
              model: 'Dog',
              populate: {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
            },
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

  async deleteByOwner(ownerId: string): Promise<Dog[]> {
    try {
      const dogs: Dog[] = await this.findByOwner(ownerId);

      dogs.forEach(async (dog) => await this.deleteOne(dog._id.toString()));

      return dogs;
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