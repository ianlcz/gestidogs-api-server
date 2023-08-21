import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { response } from 'express';

import { Reservation } from '../../reservations/schemas/reservation.schema';
import { ReservationsService } from '../../reservations/services/reservations.service';

import { CreateSessionDto } from '../dtos/createSession.dto';
import { Session, SessionDocument } from '../schemas/session.schema';
import { ActivitiesService } from '../../activities/services/activities.service';
import { WriteReportDto } from '../dtos/writeReport.dto';
import { DogsService } from '../../dogs/services/dogs.service';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly activitiesService: ActivitiesService,
    private readonly reservationsService: ReservationsService,
    private readonly dogsService: DogsService,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    try {
      // Get the duration of activity session
      let { duration }: { duration: number } =
        await this.activitiesService.findOne(
          createSessionDto.activity.toString(),
        );

      // Convert duration in millisecond
      duration *= 60000;

      // Get session begin date and convert it to timestamp
      const timestampSessionBeginDate: number = new Date(
        createSessionDto.beginDate,
      ).getTime();

      // Calculate session endDate
      createSessionDto.endDate = new Date(duration + timestampSessionBeginDate);

      // Instanciate Session Model with createSessionDto
      const sessionToCreate = new this.sessionModel(createSessionDto);

      // Save Session data on MongoDb
      await sessionToCreate.save();

      // Return the created populated Session
      return sessionToCreate.populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
        { path: 'establishment', model: 'Establishment' },
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

  async writeReport(
    sessionId: string,
    writeReportDto: WriteReportDto,
  ): Promise<Session> {
    try {
      return await this.sessionModel
        .findOneAndUpdate(
          { _id: sessionId },
          { $set: { report: writeReportDto.report } },
          { returnOriginal: false },
        )
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
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
    reserved?: boolean,
    educatorId?: string,
    activityId?: string,
    establishmentId?: string,
    begin?: Date,
    end?: Date,
  ): Promise<Session[]> {
    const sessions: Session[] = await this.sessionModel
      .find({
        ...(reserved && { reserved }),
        ...(educatorId && { educator: educatorId }),
        ...(activityId && { activity: activityId }),
        ...(establishmentId && { establishment: establishmentId }),
        ...(begin &&
          begin instanceof Date &&
          begin.getTime() && { beginDate: { $eq: begin } }),
        ...(end &&
          end instanceof Date &&
          end.getTime() && { endDate: { $eq: end } }),
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
        { path: 'establishment', model: 'Establishment' },
      ]);

    return sessions;
  }

  async findDaily(
    date: Date,
    establishmentId?: string,
  ): Promise<{ today: Session[]; next: Session[] }> {
    const tomorrow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );

    const todaySessions: Session[] = await this.sessionModel
      .find({
        ...(establishmentId && { establishment: establishmentId }),
        $and: [
          {
            beginDate: {
              $gte: new Date(date),
            },
          },
          {
            endDate: {
              $lt: new Date(tomorrow),
            },
          },
        ],
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
        { path: 'establishment', model: 'Establishment' },
      ]);

    const nextSessions: Session[] = await this.sessionModel
      .find({
        ...(establishmentId && { establishment: establishmentId }),
        beginDate: { $gte: tomorrow },
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
        { path: 'establishment', model: 'Establishment' },
      ]);

    return { today: todaySessions, next: nextSessions };
  }

  async findByDogAndDate(dogId: string, date: Date): Promise<Session[]> {
    const { sessions }: { sessions?: [Session] } =
      await this.dogsService.findOne(dogId);
    const tomorrow = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1,
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds(),
    );

    return sessions.filter(
      (session) =>
        session.beginDate >= new Date(date) &&
        session.endDate < new Date(tomorrow),
    );
  }

  async findOne(sessionId: string): Promise<Session> {
    try {
      const session: Session = await this.sessionModel
        .findById(sessionId)
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
        ]);

      if (!session) {
        throw new NotFoundException('Session not found');
      }

      return session;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Session not found.');
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

  async findByEstablishment(
    establishmentId: string,
    date?: Date,
    isReserved?: boolean,
  ): Promise<Session[]> {
    const tomorrow = new Date();
    tomorrow.setDate(date?.getDate() + 1);

    if (isReserved) {
      // Get All Reservations
      const reservations: Reservation[] = await this.reservationsService.find();

      // Get Session of each Reservation
      const sessionsReserved = reservations.map(
        (reservation) => reservation.session,
      );

      // Filter Session by establishment
      if (date != null) {
        sessionsReserved.filter(
          (session) =>
            session.activity.establishment.toString() == establishmentId &&
            session.beginDate >= date &&
            session.endDate < tomorrow,
        );
      } else {
        sessionsReserved.filter(
          (session) =>
            session.activity.establishment._id.toString() == establishmentId &&
            session.establishment._id.toString() == establishmentId,
        );
      }

      return sessionsReserved;
    } else {
      return date
        ? await this.sessionModel
            .find({
              establishment: establishmentId,
              beginDate: { $gte: date },
              endDate: { $lt: tomorrow },
            })
            .populate([
              {
                path: 'activity',
                model: 'Activity',
              },
              { path: 'educator', model: 'User', select: '-password' },
              { path: 'establishment', model: 'Establishment' },
            ])
        : await this.sessionModel
            .find({ establishment: establishmentId })
            .populate([
              {
                path: 'activity',
                model: 'Activity',
              },
              { path: 'educator', model: 'User', select: '-password' },
              { path: 'establishment', model: 'Establishment' },
            ]);
    }
  }

  async findPlacesLeft(sessionId: string): Promise<number> {
    // Get maximum capacity of the Session
    const { maximumCapacity }: { maximumCapacity: number } = await this.findOne(
      sessionId,
    );

    // Get reservations corresponding to the Session
    const reservations: Reservation[] = await this.reservationsService.find(
      sessionId,
    );

    return maximumCapacity - reservations.length;
  }

  async updateOne(sessionId: string, sessionChanges: object): Promise<Session> {
    try {
      const editSession: Session = await this.sessionModel
        .findById(sessionId)
        .populate({
          path: 'activity',
          model: 'Activity',
          select: 'duration',
        });

      if (!editSession) {
        throw new NotFoundException('Session to modify not found');
      }

      // Get the duration of activity session
      let { duration }: { duration: number } = editSession.activity;

      // Convert duration in millisecond
      duration *= 60000;

      // Get session begin date and convert it to timestamp
      const timestampSessionBeginDate: number = new Date(
        editSession.beginDate,
      ).getTime();

      // Calculate session endDate
      sessionChanges['endDate'] = new Date(
        duration + timestampSessionBeginDate,
      );

      return await this.sessionModel
        .findOneAndUpdate(
          { _id: sessionId },
          { $set: { ...sessionChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
        ]);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Session to modify not found.');
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

  async deleteOne(sessionId: string): Promise<Session> {
    try {
      const sessionToDelete = await this.sessionModel
        .findOneAndDelete({
          _id: sessionId,
        })
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
        ]);

      if (!sessionToDelete) {
        throw new NotFoundException('Session to delete not found');
      }

      response.status(HttpStatus.NO_CONTENT);

      return sessionToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Session to delete not found.');
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

  async deleteByEducator(educatorId: string): Promise<void> {
    try {
      await this.sessionModel
        .findOneAndDelete({ educator: educatorId })
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
        ]);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Sessions to delete not found.');
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

  async deleteByActivity(activityId: string): Promise<void> {
    try {
      await this.sessionModel
        .findOneAndDelete({ activity: activityId })
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
          { path: 'establishment', model: 'Establishment' },
        ]);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException();
      } else if (error instanceof NotFoundException) {
        console.log('Sessions to delete not found.');
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
