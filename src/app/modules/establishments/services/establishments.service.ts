import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { response } from 'express';

import { User } from '../../users/schemas/user.schema';
import { UsersService } from '../../users/services/users.service';

import { CreateEstablishmentDto } from '../dtos/createEstablishment.dto';
import {
  Establishment,
  EstablishmentDocument,
} from '../schemas/establishment.schema';
import { NewEmployeeDto } from '../../users/dtos/newEmployee.dto';

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
      // By default, Managers are employees of their establishments
      createEstablishmentDto.employees = [createEstablishmentDto.owner];

      // Instanciate Establishment Model with createEstablishmentDto
      const establishmentToCreate = new this.establishmentModel(
        createEstablishmentDto,
      );

      // Save Establishment data on MongoDB and return them
      return await establishmentToCreate.save();
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

  async addEmployee(
    establishmentId: string,
    newEmployeeDto: NewEmployeeDto,
  ): Promise<User[]> {
    try {
      // Get establishment employees
      const { employees }: { employees: User[] } =
        await this.establishmentModel.findById(establishmentId);

      if (employees && employees.length === 0) {
        throw new NotFoundException(
          `Employees of establishment '${establishmentId}' not found`,
        );
      }

      // Set default password when it's not defined by Manager
      if (!newEmployeeDto.password) newEmployeeDto.password = 'GestiDogs23';

      // Create new employee
      const newEmployee: User = (
        await this.usersService.register(newEmployeeDto)
      ).user;

      const newEmployees: User[] = [...employees, newEmployee];

      await this.establishmentModel.findOneAndUpdate(
        { _id: establishmentId },
        {
          $set: { employees: newEmployees },
        },
        { returnOriginal: false },
      );

      return newEmployees;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log(
          `Employees of establishment '${establishmentId}' not found`,
        );
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

  async find(ownerId?: string): Promise<Establishment[]> {
    return await this.establishmentModel
      .find({ ...(ownerId && { owner: ownerId }) })
      .populate([
        { path: 'owner', model: 'User' },
        { path: 'employees', model: 'User' },
      ]);
  }

  async findOne(establishmentId: string): Promise<Establishment> {
    try {
      const establishment: Establishment = await this.establishmentModel
        .findById(establishmentId)
        .populate([
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ]);

      if (!establishment) {
        throw new NotFoundException('Establishment not found');
      }

      return establishment;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Establishment not found.');
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

  async updateOne(
    establishmentId: string,
    establishmentChanges: object,
  ): Promise<Establishment> {
    try {
      const establishmentToModify: Establishment = await this.establishmentModel
        .findOneAndUpdate(
          { _id: establishmentId },
          {
            $set: { ...establishmentChanges },
            $inc: { __v: 1 },
          },
          { returnOriginal: false },
        )
        .populate([
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ]);

      if (!establishmentToModify) {
        throw new NotFoundException('Establishment to modify not found');
      }

      return establishmentToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Establishment to modify not found.');
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

  async deleteOne(establishmentId: string): Promise<Establishment> {
    try {
      const establishmentToDelete: Establishment = await this.establishmentModel
        .findOneAndDelete({
          _id: establishmentId,
        })
        .populate([
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ]);

      if (!establishmentToDelete) {
        throw new NotFoundException('Establishment to delete not found');
      }

      return establishmentToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Establishment to delete not found.');
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

  async deleteByOwner(ownerId: string): Promise<void> {
    try {
      await this.establishmentModel.deleteMany({ ownerId });

      response.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: 'Delete establishements successfully',
      });
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Establishments to delete not found.');
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
