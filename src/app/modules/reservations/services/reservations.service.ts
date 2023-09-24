import {
  ForbiddenException,
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
import { response } from 'express';

import { SessionsService } from '../../sessions/services/sessions.service';

import { CreateReservationDto } from '../dtos/createReservation.dto';
import {
  Reservation,
  ReservationDocument,
} from '../schemas/reservation.schema';
import { StatusSessionType } from 'src/app/common/enums/statusSession.enum';
import { UsersService } from '../../users/services/users.service';
import { ActivitiesService } from '../../activities/services/activities.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    @Inject(forwardRef(() => ActivitiesService))
    private readonly activitiesService: ActivitiesService,
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
  ) {}

  async create(
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    try {
      // Instanciate Reservation Model with createReservationDto
      const reservationToCreate = new this.reservationModel(
        createReservationDto,
      );
      const activity = await this.activitiesService.findOne(
        createReservationDto.activity.toString(),
      );

      reservationToCreate.establishment = activity.establishment;

      // Save Reservation data on MongoDB and return them
      return (await reservationToCreate.save()).populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'establishment', model: 'Establishment' },
        { path: 'session', model: 'Session' },
        {
          path: 'dogs',
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

  async find(
    sessionId?: string,
    establishmentId?: string,
    status?: string,
  ): Promise<Reservation[]> {
    return await this.reservationModel
      .find({
        ...(sessionId && { session: sessionId }),
        ...(establishmentId && { establishment: establishmentId }),
        ...(status && { status }),
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'establishment', model: 'Establishment' },
        { path: 'session', model: 'Session' },
        {
          path: 'dogs',
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
            path: 'activity',
            model: 'Activity',
          },
          { path: 'establishment', model: 'Establishment' },
          { path: 'session', model: 'Session' },
          {
            path: 'dogs',

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

  async approvedReservation(
    reservationId: string,
    educatorId: string,
    slot: Date,
  ): Promise<string> {
    try {
      const reservation = await this.reservationModel
        .findById(reservationId)
        .populate([
          {
            path: 'activity',
            model: 'Activity',
            populate: { path: 'establishment', model: 'Establishment' },
          },
        ]);

      await this.sessionsService.create({
        educator: await this.usersService.findOne(educatorId),
        activity: reservation.activity._id.toString(),
        establishment: reservation.activity.establishment._id.toString(),
        status: StatusSessionType.ONLINE,
        beginDate: slot,
        endDate: new Date(
          new Date(slot).getTime() + reservation.activity.duration * 60 * 1000,
        ),
        maximumCapacity: reservation.dogs.length,
      });

      await this.reservationModel.deleteOne({ _id: reservationId });

      response.status(201);
      response.statusMessage = 'Reservation approved';

      return response.statusMessage;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof ForbiddenException) {
        console.log('Approved denied');
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
            path: 'activity',
            model: 'Activity',
          },
          { path: 'establishment', model: 'Establishment' },
          { path: 'session', model: 'Session' },
          {
            path: 'dogs',

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
            path: 'activity',
            model: 'Activity',
          },
          { path: 'establishment', model: 'Establishment' },
          { path: 'session', model: 'Session' },
          {
            path: 'dogs',

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

      response.status(HttpStatus.NO_CONTENT);

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
