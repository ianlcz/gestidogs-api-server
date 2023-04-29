import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateObservationDto } from './dto/createObservation.dto';
import { Observation, ObservationDocument } from './observation.schema';

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
    return await this.observationModel.findById(observationId).populate({
      path: 'dog',
      model: 'Dog',
      populate: { path: 'owner', model: 'User' },
    });
  }

  async updateOne(
    observationId: string,
    observationChanges: object,
  ): Promise<Observation> {
    try {
      return await this.observationModel
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

  async deleteOne(observationId: string): Promise<Observation> {
    try {
      return await this.observationModel
        .findOneAndDelete({
          _id: observationId,
        })
        .populate({
          path: 'dog',
          model: 'Dog',
          populate: { path: 'owner', model: 'User' },
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
