import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';
import { request } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/createUser.dto';
import { AuthLoginDto } from './dto/authLogin.dto';

import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<User[]> {
    const users = await this.userModel.find();
    users.map((user) => (user.password = undefined));

    return users;
  }

  async findOne(userId: string): Promise<User> {
    try {
      const user = await this.userModel.findById(userId);
      user.password = undefined;

      return user;
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error },
        HttpStatus.NOT_FOUND,
        { cause: error },
      );
    }
  }

  async updateOne(userId: string, userChanges: object): Promise<User> {
    try {
      const modifyUser = await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: { ...userChanges },
          $inc: { __v: 1 },
        },
        { returnOriginal: false },
      );
      modifyUser.password = undefined;

      return modifyUser;
    } catch (error) {
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

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany();
  }

  async deleteOne(userId: string): Promise<User> {
    try {
      const deleteUser = await this.userModel.findOneAndDelete({ _id: userId });
      deleteUser.password = undefined;

      return deleteUser;
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

  async setLastConnectionDate(emailAddress: string): Promise<User> {
    try {
      return await this.userModel.findOneAndUpdate(
        { emailAddress },
        { lastConnectionAt: new Date() },
        {
          returnOriginal: false,
        },
      );
    } catch (error) {
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

  async register(
    createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    try {
      // Hash User password and set User registration date
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 12);
      createUserDto.registeredAt = new Date();
      createUserDto.lastConnectionAt = new Date();

      // Instanciate User Model with createUserDto
      const userToRegister = new this.userModel(createUserDto);
      const payload = {
        emailAddress: userToRegister.emailAddress,
        sub: userToRegister._id,
      };

      // Save User data on MongoDB
      await userToRegister.save();
      // Hide User password
      userToRegister.password = undefined;

      request.user = userToRegister;

      return { token: this.jwtService.sign(payload), user: userToRegister };
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

  async validateUser(credentials: AuthLoginDto): Promise<User | null> {
    const user = await this.userModel.findOne({
      emailAddress: credentials.emailAddress,
    });

    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      user.password = undefined;

      request.user = user;

      return user;
    }

    return null;
  }

  async login(
    authLoginDto: AuthLoginDto,
  ): Promise<{ token: string; user: User }> {
    const validateUser = await this.validateUser(authLoginDto);
    if (!validateUser) throw new NotFoundException();

    this.setLastConnectionDate(validateUser.emailAddress);

    const user = await this.validateUser(authLoginDto);
    const payload = {
      emailAddress: user.emailAddress,
      sub: user._id,
    };

    user.password = undefined;

    return { token: this.jwtService.sign(payload), user };
  }

  async getInfos(token: any): Promise<User> {
    const user = await this.userModel.findOne({
      emailAddress: token.emailAddress,
    });
    user.password = undefined;

    return user;
  }
}
