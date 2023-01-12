import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
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
import { JwtAuthGuard } from './jwt-auth.guard';

import { User } from './user.schema';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged',
  })
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.login(authLoginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('online')
  @ApiOperation({ summary: 'Get user logged informations' })
  async getInfos(@Req() request: Request): Promise<User> {
    return await this.usersService.getInfos(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  @ApiOperation({ summary: 'Find all users' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Find a user' })
  @ApiResponse({
    status: 200,
    description: 'The found user',
    type: User,
  })
  @ApiResponse({ status: 400, description: 'Not Found.' })
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':userId')
  @ApiOperation({ summary: 'Update user informations' })
  async updateOne(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOne(userId, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/')
  @ApiOperation({ summary: 'Empty users collection' })
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
  async deleteOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.deleteOne(userId);
  }
}
