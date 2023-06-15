import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Model } from 'mongoose';
import { request, response } from 'express';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto } from '../dtos/createUser.dto';
import { AuthLoginDto } from '../dtos/authLogin.dto';

import { User, UserDocument } from '../schemas/user.schema';

import { EstablishmentsService } from '../../establishments/services/establishments.service';

import { DogsService } from '../../dogs/services/dogs.service';
import { UpdateUserDto } from '../dtos/updateUser.dto';

import { RoleType } from '../../../common/enums/role.enum';
import { Dog } from '../../dogs/schemas/dog.schema';
import { Establishment } from '../../establishments/schemas/establishment.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private establishmentsService: EstablishmentsService,
    private dogsService: DogsService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private async getTokens(
    userId: string,
    emailAddress: string,
    role: RoleType,
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
          expiresIn: '1h',
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

  private async validateUser(credentials: AuthLoginDto): Promise<User> {
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

  private async setLastConnectionDate(emailAddress: string): Promise<void> {
    try {
      const userToSetLastConnectionDate: User =
        await this.userModel.findOneAndUpdate(
          { emailAddress },
          { lastConnectionAt: new Date() },
          {
            returnOriginal: false,
          },
        );

      if (!userToSetLastConnectionDate) {
        throw new NotFoundException('User not found');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('User not found.');
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

  async find(establishmentId?: string, role?: RoleType): Promise<User[]> {
    let employees: User[] = [];

    if (establishmentId) {
      // Get All employees of the Establishment
      employees = (await this.establishmentsService.findOne(establishmentId))
        .employees;
    } else {
      employees = await this.userModel.find();
    }

    // Get All dog owners
    const dogs: Dog[] = await this.dogsService.find(undefined, establishmentId);
    const clients: User[] = dogs.map((dog: Dog) => dog.owner);

    return role
      ? [...new Set([...employees, ...clients])].filter(
          (user: User) => user.role === role,
        )
      : [...new Set([...employees, ...clients])];
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

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Hide User password
      user.password = undefined;

      return user;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('User not found.');
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

      if (!modifyUser) {
        throw new NotFoundException('User to modify not found');
      }

      // Hide User password
      modifyUser.password = undefined;

      return modifyUser;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('User to modify not found.');
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

  async deleteOne(userId: string): Promise<User> {
    try {
      const userToDelete: User = await this.userModel.findOne({ _id: userId });

      if (!userToDelete) {
        throw new NotFoundException('User to delete not found');
      }

      // Delete User dogs
      await this.dogsService.deleteByOwner(userId);

      // Delete User establishments
      await this.establishmentsService.deleteByOwner(userId);

      // Delete User
      await this.userModel.deleteOne({ _id: userId });

      // Hide User password
      userToDelete.password = undefined;

      response.status(HttpStatus.NO_CONTENT);

      return userToDelete;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('User to delete not found.');
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
    await this.userModel.findOneAndUpdate(
      { _id: userId },
      { refreshToken: null },
    );
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
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens = await this.getTokens(user.id, user.emailAddress, user.role);

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async getInfos(token: any) {
    try {
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

      if (!user) {
        throw new NotFoundException('User not found');
      }

      if (user.role === RoleType.MANAGER) {
        // Get User logged establishments
        const establishments: Establishment[] =
          await this.establishmentsService.find(user._id.toString());

        return { ...user, establishments };
      } else {
        return user;
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else if (error instanceof NotFoundException) {
        console.log('User not found.');
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
