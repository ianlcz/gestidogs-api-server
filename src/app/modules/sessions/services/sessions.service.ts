import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { Reservation } from '../../reservations/schemas/reservation.schema';
import { ReservationsService } from '../../reservations/services/reservations.service';

import { CreateSessionDto } from '../dtos/createSession.dto';
import { Session, SessionDocument } from '../schemas/session.schema';
import { ActivitiesService } from '../../activities/services/activities.service';
import { WriteReportDto } from '../dtos/writeReport.dto';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
    private readonly activitiesService: ActivitiesService,
    private readonly reservationsService: ReservationsService,
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

  async findAll(): Promise<Session[]> {
    return await this.sessionModel.find().populate([
      {
        path: 'activity',
        model: 'Activity',
      },
      { path: 'educator', model: 'User', select: '-password' },
    ]);
  }

  async findOne(sessionId: string): Promise<Session> {
    try {
      return await this.sessionModel.findById(sessionId).populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
      ]);
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

  async findByEducator(educatorId: string): Promise<Session[]> {
    return await this.sessionModel.find({ educator: educatorId }).populate([
      {
        path: 'activity',
        model: 'Activity',
      },
      { path: 'educator', model: 'User', select: '-password' },
    ]);
  }

  async findEducatorSessionsByDate(
    educatorId: string,
    date: Date,
  ): Promise<{ today: Session[]; next: Session[] }> {
    const tomorrow = new Date();
    tomorrow.setDate(date.getDate() + 1);

    const todaySessions: Session[] = await this.sessionModel
      .find({
        educator: educatorId,
        $and: [
          {
            beginDate: {
              $gte: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate(),
              ),
            },
          },
          {
            endDate: {
              $lt: new Date(
                date.getFullYear(),
                date.getMonth(),
                date.getDate() + 1,
              ),
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
      ]);

    const nextSessions: Session[] = await this.sessionModel
      .find({
        educator: educatorId,
        beginDate: { $gte: tomorrow },
        endDate: { $lt: new Date(Date.now() + 31536000000) },
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
        },
        { path: 'educator', model: 'User', select: '-password' },
      ]);

    return { today: todaySessions, next: nextSessions };
  }

  async findByActivity(activityId: string): Promise<Session[]> {
    return await this.sessionModel.find({ activity: activityId }).populate([
      {
        path: 'activity',
        model: 'Activity',
      },
      { path: 'educator', model: 'User', select: '-password' },
    ]);
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
            ])
        : await this.sessionModel
            .find({ establishment: establishmentId })
            .populate([
              {
                path: 'activity',
                model: 'Activity',
              },
              { path: 'educator', model: 'User', select: '-password' },
            ]);
    }
  }

  async findPlacesLeft(sessionId: string): Promise<number> {
    // Get maximum capacity of the Session
    const { maximumCapacity }: { maximumCapacity: number } = await this.findOne(
      sessionId,
    );

    // Get reservations corresponding to the Session
    const reservations = await this.reservationsService.find(sessionId);

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

  async deleteOne(sessionId: string): Promise<Session> {
    try {
      return await this.sessionModel
        .findOneAndDelete({
          _id: sessionId,
        })
        .populate([
          {
            path: 'activity',
            model: 'Activity',
          },
          { path: 'educator', model: 'User', select: '-password' },
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
