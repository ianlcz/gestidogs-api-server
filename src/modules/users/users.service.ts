import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Model } from 'mongoose';
import { request } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from './dto/createUser.dto';
import { AuthLoginDto } from './dto/authLogin.dto';

import { User, UserDocument } from './user.schema';

import { EstablishmentsService } from '../establishments/establishments.service';

import { DogsService } from '../dogs/dogs.service';
import { UpdateUserDto } from './dto/updateUser.dto';

import { Role } from 'src/enums/role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private establishmentsService: EstablishmentsService,
    private dogsService: DogsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    const users: User[] = await this.userModel.find().populate({
      path: 'activities',
      model: 'Activity',
      populate: [
        {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      ],
    });

    users.map((user) => (user.password = undefined));

    return users;
  }

  async findOne(userId: string): Promise<User> {
    try {
      const user: User = await this.userModel.findById(userId).populate({
        path: 'activities',
        model: 'Activity',
        populate: [
          {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        ],
      });

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

      const modifyUser: User = await this.userModel
        .findOneAndUpdate(
          { _id: userId },
          {
            $set: { ...userChanges },
            $inc: { __v: 1 },
          },
          { returnOriginal: false },
        )
        .populate({
          path: 'activities',
          model: 'Activity',
          populate: [
            {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          ],
        });

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
      const deleteUser: User = await this.userModel
        .findOneAndDelete({ _id: userId })
        .populate({
          path: 'activities',
          model: 'Activity',
          populate: [
            {
              path: 'establishment',
              model: 'Establishment',
              populate: [
                { path: 'owner', model: 'User' },
                { path: 'employees', model: 'User' },
              ],
            },
          ],
        });

      // Delete User dogs
      await this.dogsService.deleteByOwner(userId);

      // Delete User establishments
      await this.establishmentsService.deleteByOwner(userId);

      // Hide User password
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

  async register(createUserDto: CreateUserDto): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: User;
  }> {
    try {
      // Check if user exists
      const userExists = await this.userModel.findOne({
        emailAddress: createUserDto.emailAddress,
      });

      if (userExists) {
        throw new BadRequestException('User already exists');
      }

      // Hash User password and set User registration date
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 12);
      createUserDto.registeredAt = new Date();
      createUserDto.lastConnectionAt = new Date();

      // Instanciate User Model with createUserDto
      const newUser = new this.userModel(createUserDto);

      // Save User data on MongoDB
      await newUser.save();

      const tokens = await this.getTokens(
        newUser._id.toString(),
        newUser.emailAddress,
        newUser.role,
      );
      await this.updateRefreshToken(
        newUser._id.toString(),
        tokens.refreshToken,
      );

      // Hide User password
      newUser.password = undefined;

      request.user = newUser;

      return { tokens, user: newUser };
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
    const user: User = await this.userModel
      .findOne({
        emailAddress: credentials.emailAddress,
      })
      .populate({
        path: 'activities',
        model: 'Activity',
        populate: [
          {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        ],
      });
    if (!user) throw new BadRequestException('User does not exist');

    const passwordMatches = bcrypt.compareSync(
      credentials.password,
      user.password,
    );

    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    // Hide User password
    user.password = undefined;

    request.user = user;

    return user;
  }

  async login(data: AuthLoginDto): Promise<{
    tokens: { accessToken: string; refreshToken: string };
    user: User;
  }> {
    const validatedUser = await this.validateUser(data);

    this.setLastConnectionDate(validatedUser.emailAddress);

    const user = await this.validateUser(data);

    const tokens = await this.getTokens(
      user._id.toString(),
      user.emailAddress,
      user.role,
    );
    await this.updateRefreshToken(user._id.toString(), tokens.refreshToken);

    // Hide User password
    user.password = undefined;

    return { tokens, user };
  }

  async logout(userId: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedRefreshToken = bcrypt.hashSync(refreshToken, 12);

    await this.userModel.updateOne(
      { _id: userId },
      { refreshToken: hashedRefreshToken },
    );
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const user = await this.userModel.findById(userId).populate({
      path: 'activities',
      model: 'Activity',
      populate: [
        {
          path: 'establishment',
          model: 'Establishment',
          populate: [
            { path: 'owner', model: 'User' },
            { path: 'employees', model: 'User' },
          ],
        },
      ],
    });

    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    const refreshTokenMatches = bcrypt.compareSync(
      user.refreshToken,
      refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.emailAddress, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async getInfos(token: any): Promise<User> {
    const user = await this.userModel
      .findOne({
        emailAddress: token.emailAddress,
      })
      .populate({
        path: 'activities',
        model: 'Activity',
        populate: [
          {
            path: 'establishment',
            model: 'Establishment',
            populate: [
              { path: 'owner', model: 'User' },
              { path: 'employees', model: 'User' },
            ],
          },
        ],
      });

    // Hide User password
    user.password = undefined;

    return user;
  }

  async getTokens(
    userId: string,
    emailAddress: string,
    role: Role,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          emailAddress,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          emailAddress,
          role,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
