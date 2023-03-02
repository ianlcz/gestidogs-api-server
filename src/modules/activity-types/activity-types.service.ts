import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { ActivityType, ActivityTypeDocument } from './activity-type.schema';
import { CreateActivityTypeDto } from './dto/createActivityType.dto';

@Injectable()
export class ActivityTypesService {
  constructor(
    @InjectModel(ActivityType.name)
    private readonly activityTypeModel: Model<ActivityTypeDocument>,
  ) {}

  async create(
    createActivityTypeDto: CreateActivityTypeDto,
  ): Promise<ActivityType> {
    try {
      // Instanciate Dog Model with createDogDto
      const activityTypeToCreate = new this.activityTypeModel(
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

  async findAll(): Promise<ActivityType[]> {
    return await this.activityTypeModel.find();
  }

  async findOne(activityTypeId: string): Promise<ActivityType> {
    try {
      return await this.activityTypeModel.findById(activityTypeId);
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
  ): Promise<ActivityType> {
    try {
      return await this.activityTypeModel.findByIdAndUpdate(
        {
          _id: activityTypeId,
        },
        { $set: { ...activityTypeChanges }, $inc: { __v: 1 } },
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
    await this.activityTypeModel.deleteMany();
  }

  async deleteOne(activityTypeId: string): Promise<ActivityType> {
    try {
      const activityType = await this.activityTypeModel.findByIdAndDelete({
        _id: activityTypeId,
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
