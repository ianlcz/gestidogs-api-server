import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
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
      return (await reservationToCreate.save()).populate([
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
          populate: [
            {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
            {
              path: 'owner',
              model: 'User',
            },
          ],
        },
      ]);
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
          populate: [
            {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
            {
              path: 'owner',
              model: 'User',
            },
          ],
        },
      ]);
  }

  async findOne(reservationId: string): Promise<Reservation> {
    try {
      const reservation: Reservation = await this.reservationModel
        .findById(reservationId)
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
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
              {
                path: 'owner',
                model: 'User',
              },
            ],
          },
        ]);

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      return reservation;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Reservation not found.');
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
    reservationId: string,
    reservationChanges: object,
  ): Promise<Reservation> {
    try {
      const reservationToModify: Reservation = await this.reservationModel
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
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
              {
                path: 'owner',
                model: 'User',
              },
            ],
          },
        ]);

      if (!reservationToModify) {
        throw new NotFoundException('Reservation to modify not found');
      }

      return reservationToModify;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Reservation to modify not found.');
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

  async deleteOne(reservationId: string): Promise<Reservation> {
    try {
      const reservationToDelete: Reservation = await this.reservationModel
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
            populate: [
              {
                path: 'establishment',
                model: 'Establishment',
                populate: [
                  { path: 'owner', model: 'User' },
                  { path: 'employees', model: 'User' },
                ],
              },
              {
                path: 'owner',
                model: 'User',
              },
            ],
          },
        ]);

      if (!reservationToDelete) {
        throw new NotFoundException('Reservation to delete not found');
      }

      return reservationToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Reservation to delete not found.');
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
