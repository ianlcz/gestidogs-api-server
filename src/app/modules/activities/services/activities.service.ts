import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
      const activity: Activity = await this.activityModel
        .findById(activityId)
        .populate({
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        });

      if (!activity) {
        throw new NotFoundException('Activity not found');
      }

      return activity;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('Activity not found.');
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
    activityId: string,
    activityChanges: object,
  ): Promise<Activity> {
    try {
      const activityToModify: Activity = await this.activityModel
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

      if (!activityToModify) {
        throw new NotFoundException('Activity to modify not found');
      }

      return activityToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('Activity to modify not found.');
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

  async deleteOne(activityId: string): Promise<Activity> {
    try {
      const activityToDelete = await this.activityModel
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

      if (!activityToDelete) {
        throw new NotFoundException('Activity to delete not found');
      }

      return activityToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('Activity to delete not found.');
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
