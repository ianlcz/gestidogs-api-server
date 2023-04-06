import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { User } from '../users/user.schema';

import { UsersService } from '../users/users.service';

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
    newEmployeeId: string,
  ): Promise<User[]> {
    const { employees }: { employees: User[] } =
      await this.establishmentModel.findById(establishmentId);
    if (!employees) {
      throw new NotFoundException(
        `Employees of establishment '${establishmentId}' not found`,
      );
    }

    const newEmployee = await this.usersService.findOne(newEmployeeId);
    if (!newEmployeeId) {
      throw new NotFoundException(`Employee '${newEmployeeId}' not found`);
    }

    try {
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
      throw new HttpException(
        { status: HttpStatus.BAD_REQUEST, error },
        HttpStatus.BAD_REQUEST,
        { cause: error },
      );
    }
  }

  async findAll(): Promise<Establishment[]> {
    return await this.establishmentModel.find().populate([
      { path: 'owner', model: 'User' },
      { path: 'employees', model: 'User' },
    ]);
  }

  async findOne(establishmentId: string): Promise<Establishment> {
    try {
      return await this.establishmentModel.findById(establishmentId).populate([
        { path: 'owner', model: 'User' },
        { path: 'employees', model: 'User' },
      ]);
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  async findByOwner(ownerId: string): Promise<Establishment[]> {
    return await this.establishmentModel.find({ owner: ownerId }).populate([
      { path: 'owner', model: 'User' },
      { path: 'employees', model: 'User' },
    ]);
  }

  async updateOne(
    establishmentId: string,
    establishmentChanges: object,
  ): Promise<Establishment> {
    try {
      return await this.establishmentModel
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
  
  async deleteOne(establishmentId: string): Promise<Establishment> {
    try {
      return await this.establishmentModel
        .findOneAndDelete({
          _id: establishmentId,
        })
        .populate([
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ]);
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
