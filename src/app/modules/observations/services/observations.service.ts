import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateObservationDto } from '../dtos/createObservation.dto';
import {
  Observation,
  ObservationDocument,
} from '../schemas/observation.schema';

@Injectable()
export class ObservationsService {
  constructor(
    @InjectModel(Observation.name)
    private observationModel: Model<ObservationDocument>,
  ) {}

  async create(
    createObservationDto: CreateObservationDto,
  ): Promise<Observation> {
    try {
      // Instanciate Observation Model with createObservationDto
      const observationToCreate = new this.observationModel(
        createObservationDto,
      );

      // Save Observation data on MongoDB and return them
      return await observationToCreate.save();
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

  async find(dogId?: string): Promise<Observation[]> {
    return await this.observationModel
      .find({ ...(dogId && { dog: dogId }) })
      .populate({
        path: 'dog',
        model: 'Dog',
        populate: { path: 'owner', model: 'User' },
      });
  }

  async findOne(observationId: string): Promise<Observation> {
    try {
      const observation: Observation = await this.observationModel
        .findById(observationId)
        .populate({
          path: 'dog',
          model: 'Dog',
          populate: { path: 'owner', model: 'User' },
        });

      if (!observation) {
        throw new NotFoundException('Observation not found');
      }

      return observation;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Observation not found.');
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
    observationId: string,
    observationChanges: object,
  ): Promise<Observation> {
    try {
      const observationToModify = await this.observationModel
        .findOneAndUpdate(
          { _id: observationId },
          { $set: { ...observationChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate({
          path: 'dog',
          model: 'Dog',
          populate: { path: 'owner', model: 'User' },
        });

      if (!observationToModify) {
        throw new NotFoundException('Observation to modify not found');
      }

      return observationToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Observation to modify not found.');
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

  async deleteOne(observationId: string): Promise<Observation> {
    try {
      const observationToDelete = await this.observationModel
        .findOneAndDelete({
          _id: observationId,
        })
        .populate({
          path: 'dog',
          model: 'Dog',
          populate: { path: 'owner', model: 'User' },
        });

      if (!observationToDelete) {
        throw new NotFoundException('Observation to delete not found');
      }

      return observationToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Observation to delete not found.');
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
