import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateSessionDto } from './dto/createSession.dto';
import { Session, SessionDocument } from './session.schema';

@Injectable()
export class SessionsService {
  constructor(
    @InjectModel(Session.name)
    private readonly sessionModel: Model<SessionDocument>,
  ) {}

  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    try {
      // Instanciate Session Model with createSessionDto
      const sessionToCreate = new this.sessionModel(createSessionDto);

      // Save Session data on MongoDb and return them
      return await sessionToCreate.save();
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
        populate: {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      },
      { path: 'educator', model: 'User' },
    ]);
  }

  async findOne(sessionId: string): Promise<Session> {
    try {
      return await this.sessionModel.findById(sessionId).populate([
        {
          path: 'activity',
          model: 'Activity',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
        { path: 'educator', model: 'User' },
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
    return await this.sessionModel.find({ educatorId }).populate([
      {
        path: 'activity',
        model: 'Activity',
        populate: {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      },
      { path: 'educator', model: 'User' },
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
        educatorId,
        beginDate: { $gte: date },
        endDate: { $lt: tomorrow },
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
        { path: 'educator', model: 'User' },
      ]);
    const nextSessions: Session[] = await this.sessionModel
      .find({
        educatorId,
        beginDate: { $gte: tomorrow },
      })
      .populate([
        {
          path: 'activity',
          model: 'Activity',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
        { path: 'educator', model: 'User' },
      ]);

    return { today: todaySessions, next: nextSessions };
  }

  async findByActivity(activityId: string): Promise<Session[]> {
    return await this.sessionModel.find({ activityId }).populate([
      {
        path: 'activity',
        model: 'Activity',
        populate: {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      },
      { path: 'educator', model: 'User' },
    ]);
  }

  async findByEstablishment(establishmentId: string): Promise<Session[]> {
    return await this.sessionModel.find({ establishment : establishmentId });
  }
  
  async updateOne(sessionId: string, sessionChanges: object): Promise<Session> {
    try {
      return await this.sessionModel
        .findByIdAndUpdate(
          { _id: sessionId },
          { $set: { ...sessionChanges }, $inc: { __v: 1 } },
          { returnOriginal: false },
        )
        .populate([
          {
            path: 'activity',
            model: 'Activity',
            populate: {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          },
          { path: 'educator', model: 'User' },
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

  async deleteAll(): Promise<void> {
    await this.sessionModel.deleteMany();
  }

  async deleteOne(sessionId: string): Promise<Session> {
    try {
      return await this.sessionModel
        .findByIdAndDelete({
          _id: sessionId,
        })
        .populate([
          {
            path: 'activity',
            model: 'Activity',
            populate: {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          },
          { path: 'educator', model: 'User' },
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
      await this.sessionModel.findOneAndDelete({ educatorId }).populate([
        {
          path: 'activity',
          model: 'Activity',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
        { path: 'educator', model: 'User' },
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
      await this.sessionModel.findByIdAndDelete({ activityId }).populate([
        {
          path: 'activity',
          model: 'Activity',
          populate: {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        },
        { path: 'educator', model: 'User' },
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
