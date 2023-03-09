import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

import { Model } from 'mongoose';
import { request } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/createUser.dto';
import { AuthLoginDto } from './dto/authLogin.dto';

import { User, UserDocument } from './user.schema';

import { EstablishmentsService } from '../establishments/establishments.service';
import { DogsService } from '../dogs/dogs.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly establishmentsService: EstablishmentsService,
    private readonly dogsService: DogsService,
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

      // Hide User password
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

  async updateOne(userId: string, userChanges: UpdateUserDto): Promise<User> {
    try {
      // Hashing new user password
      userChanges.password = bcrypt.hashSync(userChanges.password, 12);

      const modifyUser = await this.userModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: { ...userChanges },
          $inc: { __v: 1 },
        },
        { returnOriginal: false },
      );

      // Hide User password
      modifyUser.password = undefined;

      return modifyUser;
    } catch (error) {
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

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany();
    await this.establishmentsService.deleteAll();
    await this.dogsService.deleteAll();
  }

  async deleteOne(userId: string): Promise<User> {
    try {
      const deleteUser = await this.userModel.findOneAndDelete({ _id: userId });

      // Hide User password
      deleteUser.password = undefined;

      deleteUser.dogs.map(
        async (dog) => await this.dogsService.deleteOne(dog._id.toString()),
      );
      await this.establishmentsService.deleteByOwner(userId);

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

  async setLastConnectionDate(emailAddress: string): Promise<void> {
    try {
      await this.userModel.findOneAndUpdate(
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

  async setDog(userId: string, dogId: string): Promise<void> {
    try {
      const { dogs } = await this.findOne(userId);

      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { dogs: [...dogs, dogId] },
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

  async deleteDog(userId: string, dogId: string): Promise<void> {
    try {
      const { dogs } = await this.findOne(userId);

      await this.userModel.findOneAndUpdate(
        { _id: userId },
        { dogs: dogs.filter((dog) => dog.toString() !== dogId) },
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

  async validateUser(credentials: AuthLoginDto): Promise<User> {
    const user: User = await this.userModel.findOne({
      emailAddress: credentials.emailAddress,
    });

    if (user && bcrypt.compareSync(credentials.password, user.password)) {
      // Hide User password
      user.password = undefined;

      request.user = user;

      return user;
    }

    throw new BadRequestException();
  }

  async login(
    authLoginDto: AuthLoginDto,
  ): Promise<{ token: string; user: User }> {
    const validateUser = await this.validateUser(authLoginDto);

    this.setLastConnectionDate(validateUser.emailAddress);

    const user = await this.validateUser(authLoginDto);

    const payload = {
      sub: user._id,
      emailAddress: user.emailAddress,
      role: user.role,
    };

    // Hide User password
    user.password = undefined;

    return { token: this.jwtService.sign(payload), user };
  }

  async getInfos(token: any): Promise<User> {
    const user = await this.userModel.findOne({
      emailAddress: token.emailAddress,
    });

    // Hide User password
    user.password = undefined;

    return user;
  }
}
