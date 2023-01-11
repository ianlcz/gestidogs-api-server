import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/createUser.dto';
import { User, UserDocument } from './user.schema';
import { AuthLoginDto } from './dto/authLogin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async setLastConnectionDate(emailAddress: string) {
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

  async validateUser(credentials: AuthLoginDto): Promise<User | null> {
    const user = await this.userModel.findOne({
      emailAddress: credentials.emailAddress,
    });

    if (user && bcrypt.compareSync(credentials.password, user.password)) {
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
}
