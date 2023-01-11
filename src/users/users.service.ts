import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Hash User password and set User registration date
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 12);
      createUserDto.registeredAt = new Date();

      // Instanciate User Model with createUserDto
      const userToRegister = new this.userModel(createUserDto);

      // Save User data on MongoDB
      await userToRegister.save();
      // Hide User password
      userToRegister.password = undefined;

      return userToRegister;
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
