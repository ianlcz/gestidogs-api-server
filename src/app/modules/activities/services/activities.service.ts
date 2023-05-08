import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Activity, ActivityDocument } from '../schemas/activity.schema';
import { CreateActivityDto } from '../dtos/createActivity.dto';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectModel(Activity.name) private activityModel: Model<ActivityDocument>,
  ) {}

  async create(createActivityDto: CreateActivityDto): Promise<Activity> {
    try {
      // Instanciate Dog Model with createDogDto
      const activityToCreate = new this.activityModel(createActivityDto);

      // Save ActivityType data on MongoDB and return them
      return await activityToCreate.save();
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

  async findOne(activityId: string): Promise<Activity> {
    try {
      return await this.activityModel.findById(activityId).populate({
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
    activityId: string,
    activityChanges: object,
  ): Promise<Activity> {
    try {
      return await this.activityModel
        .findByIdAndUpdate(
          {
            _id: activityId,
          },
          { $set: { ...activityChanges }, $inc: { __v: 1 } },
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

  async deleteOne(activityId: string): Promise<Activity> {
    try {
      const activity = await this.activityModel
        .findByIdAndDelete({
          _id: activityId,
        })
        .populate({
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        });

      return activity;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }
}
