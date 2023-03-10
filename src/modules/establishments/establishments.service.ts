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

import { UsersService } from '../users/users.service';

import { Role } from '../../enums/role.enum';

import { CreateEstablishmentDto } from './dto/createEstablishment.dto';
import { Establishment, EstablishmentDocument } from './establishment.schema';

@Injectable()
export class EstablishmentsService {
  constructor(
    @InjectModel(Establishment.name)
    private readonly establishmentModel: Model<EstablishmentDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
  ) {}

  async create(
    createEstablishmentDto: CreateEstablishmentDto,
  ): Promise<Establishment> {
    try {
      const owner = await this.usersService.findOne(
        createEstablishmentDto.owner._id.toString(),
      );

      // By default, Managers are employees of their establishments
      createEstablishmentDto.employees = [createEstablishmentDto.owner];

      if (
        owner &&
        (owner.role === Role.ADMINISTRATOR || owner.role === Role.MANAGER)
      ) {
        // Instanciate Establishment Model with createEstablishmentDto
        const establishmentToCreate = new this.establishmentModel(
          createEstablishmentDto,
        );

        // Save Establishment data on MongoDB and return them
        return await establishmentToCreate.save();
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else {
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

  async findAll(): Promise<Establishment[]> {
    return await this.establishmentModel.find();
  }

  async findOne(establishmentId: string): Promise<Establishment> {
    try {
      return await this.establishmentModel.findById(establishmentId);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  async findByOwner(ownerId: string): Promise<Establishment[]> {
    return await this.establishmentModel.find({ ownerId });
  }

  async updateOne(
    establishmentId: string,
    establishmentChanges: object,
  ): Promise<Establishment> {
    try {
      return await this.establishmentModel.findOneAndUpdate(
        { _id: establishmentId },
        {
          $set: { ...establishmentChanges },
          $inc: { __v: 1 },
        },
        { returnOriginal: false },
      );
    } catch (error) {
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

  async deleteAll(): Promise<void> {
    await this.establishmentModel.deleteMany();
  }

  async deleteOne(establishmentId: string): Promise<Establishment> {
    try {
      return await this.establishmentModel.findOneAndDelete({
        _id: establishmentId,
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

  async deleteByOwner(ownerId: string): Promise<void> {
    try {
      await this.establishmentModel.deleteMany({ ownerId });
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
