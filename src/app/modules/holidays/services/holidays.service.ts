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

import { Holiday, HolidayDocument } from '../schemas/holiday.schema';
import { CreateHolidayDto } from '../dtos/createHoliday.dto';

@Injectable()
export class HolidaysService {
  constructor(
    @InjectModel(Holiday.name)
    private readonly holidayModel: Model<HolidayDocument>,
  ) {}

  async create(createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    try {
      // Instanciate Holiday Model with createHolidayDto
      const holidayToCreate = new this.holidayModel(createHolidayDto);

      // Save Holiday data on MongoDB and return them
      return await holidayToCreate.save();
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

  async find(employeeId?: string): Promise<Holiday[]> {
    return await this.holidayModel
      .find({ ...(employeeId && { employee: employeeId }) })
      .populate({
        path: 'employee',
        model: 'User',
        populate: {
          path: 'activities',
          model: 'Activity',
          populate: [
            {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          ],
        },
      });
  }

  async findOne(holidayId: string): Promise<Holiday> {
    try {
      const holiday: Holiday = await this.holidayModel
        .findById(holidayId)
        .populate({
          path: 'employee',
          model: 'User',
          populate: {
            path: 'activities',
            model: 'Activity',
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
            ],
          },
        });

      if (!holiday) {
        throw new NotFoundException('Holiday not found');
      }

      return holiday;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Holiday not found.');
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

  async updateOne(holidayId: string, holidayChanges: object): Promise<Holiday> {
    try {
      const holidayToModify: Holiday = await this.holidayModel
        .findOneAndUpdate(
          { _id: holidayId },
          { $set: { ...holidayChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate({
          path: 'employee',
          model: 'User',
          populate: {
            path: 'activities',
            model: 'Activity',
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
            ],
          },
        });

      if (!holidayToModify) {
        throw new NotFoundException('Holiday to modify not found');
      }

      return holidayToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Holiday to modify not found.');
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

  async deleteOne(holidayId: string): Promise<Holiday> {
    try {
      const holidayToDelete: Holiday = await this.holidayModel
        .findOneAndDelete({ _id: holidayId })
        .populate({
          path: 'employee',
          model: 'User',
          populate: {
            path: 'activities',
            model: 'Activity',
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
            ],
          },
        });

      if (!holidayToDelete) {
        throw new NotFoundException('Holiday to delete not found');
      }

      response.status(HttpStatus.NO_CONTENT);

      return holidayToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Holiday to delete not found.');
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
