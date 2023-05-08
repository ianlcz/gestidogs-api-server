import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { SessionsService } from '../../sessions/services/sessions.service';

import { CreateReservationDto } from '../dtos/createReservation.dto';
import {
  Reservation,
  ReservationDocument,
} from '../schemas/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      // Get maximun capacity of the session
      const { maximumCapacity } = await this.sessionsService.findOne(
        createReservationDto.session.toString(),
      );

      // By default, Reservation is approved only when Session maximum capacity is 1
      createReservationDto.isApproved = maximumCapacity === 1;

      // Instanciate Reservation Model with createReservationDto
      const reservationToCreate = new this.reservationModel(
        createReservationDto,
      );

      // Save Reservation data on MongoDB and return them
      return await reservationToCreate.save();
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

  async find(sessionId?: string): Promise<Reservation[]> {
    return await this.reservationModel
      .find({ ...(sessionId && { session: sessionId }) })
      .populate([
        {
          path: 'session',
          model: 'Session',
          populate: [
            {
              path: 'activity',
              model: 'Activity',
            },
            { path: 'educator', model: 'User' },
          ],
        },
        {
          path: 'dog',
          model: 'Dog',
          populate: {
            path: 'owner',
            model: 'User',
          },
        },
      ]);
  }

  async findOne(reservationId: string): Promise<Reservation> {
    return await this.reservationModel.findById(reservationId).populate([
      {
        path: 'session',
        model: 'Session',
        populate: [
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User' },
        ],
      },
      {
        path: 'dog',
        model: 'Dog',
        populate: {
          path: 'owner',
          model: 'User',
        },
      },
    ]);
  }

  async updateOne(
    reservationId: string,
    reservationChanges: object,
  ): Promise<Reservation> {
    try {
      return await this.reservationModel
        .findOneAndUpdate(
          {
            _id: reservationId,
          },
          { $set: { ...reservationChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate([
          {
            path: 'session',
            model: 'Session',
            populate: [
              {
                path: 'activity',
                model: 'Activity',
              },
              { path: 'educator', model: 'User' },
            ],
          },
          {
            path: 'dog',
            model: 'Dog',
            populate: {
              path: 'owner',
              model: 'User',
            },
          },
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

  async deleteOne(reservationId: string): Promise<Reservation> {
    try {
      return await this.reservationModel
        .findOneAndDelete({
          _id: reservationId,
        })
        .populate([
          {
            path: 'session',
            model: 'Session',
            populate: [
              {
                path: 'activity',
                model: 'Activity',
              },
              { path: 'educator', model: 'User' },
            ],
          },
          {
            path: 'dog',
            model: 'Dog',
            populate: {
              path: 'owner',
              model: 'User',
            },
          },
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
}
