import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { SessionsService } from '../sessions/sessions.service';

import { CreateReservationDto } from './dto/createReservation.dto';
import { Reservation, ReservationDocument } from './reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
    private sessionsService: SessionsService,
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
}
