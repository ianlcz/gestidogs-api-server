import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Activity, ActivityDocument } from './activity.schema';
import { CreateActivityDto } from './dto/createActivity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(createActivityTypeDto: CreateActivityDto): Promise<Activity> {
    try {
      // Instanciate Dog Model with createDogDto
      const activityTypeToCreate = new this.activityModel(
        createActivityTypeDto,
      );

      // Save ActivityType data on MongoDB and return them
      return await activityTypeToCreate.save();
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.UNPROCESSABLE_ENTITY, error },
        HttpStatus.UNPROCESSABLE_ENTITY,
        { cause: error },
      );
    }
  }

  async find(establishmentId?: string): Promise<Activity[]> {
    return await this.activityModel
      .find({
        ...(establishmentId && { establishment: establishmentId }),
      })
      .populate({
        path: 'establishment',
        model: 'Establishment',
        populate: [
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ],
      });
  }

  async findOne(activityTypeId: string): Promise<Activity> {
    try {
      return await this.activityModel.findById(activityTypeId).populate({
        path: 'establishment',
        model: 'Establishment',
        populate: [
          { path: 'owner', model: 'User' },
          { path: 'employees', model: 'User' },
        ],
      });
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

  async updateOne(
    activityTypeId: string,
    activityTypeChanges: object,
  ): Promise<Activity> {
    try {
      return await this.activityModel
        .findByIdAndUpdate(
          {
            _id: activityTypeId,
          },
          { $set: { ...activityTypeChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate({
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        });
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

  async deleteOne(activityTypeId: string): Promise<Activity> {
    try {
      const activityType = await this.activityModel
        .findByIdAndDelete({
          _id: activityTypeId,
        })
        .populate({
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        });

      return activityType;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
