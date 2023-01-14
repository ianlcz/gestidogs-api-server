import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthLoginDto } from './dto/authLogin.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
@ApiBearerAuth()
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('online')
  @ApiOperation({ summary: 'Get user logged informations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The logged user',
    type: User,
  })
  async getInfos(@Req() request: Request): Promise<User> {
    return await this.usersService.getInfos(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
    type: [User],
  })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Find a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Not Found' })
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':userId')
  @ApiOperation({ summary: 'Update user informations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified user',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  async updateOne(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOne(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  @ApiOperation({ summary: 'Remove all users' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all users',
  })
  async deleteAll(@Res() response: Response) {
    await this.usersService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'Users' Collection`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':userId')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted user',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  async deleteOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.deleteOne(userId);
  }
}
