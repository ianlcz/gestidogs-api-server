import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Holiday, HolidayDocument } from './holiday.schema';
import { CreateHolidayDto } from './dto/createHoliday.dto';

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
    return await this.holidayModel.findById(holidayId).populate({
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

  async updateOne(holidayId: string, holidayChanges: object): Promise<Holiday> {
    try {
      return await this.holidayModel
        .findByIdAndUpdate(
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

  async deleteOne(holidayId: string): Promise<Holiday> {
    try {
      return await this.holidayModel
        .findByIdAndDelete({ _id: holidayId })
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
