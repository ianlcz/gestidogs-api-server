import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthLoginDto } from './dto/authLogin.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('online')
  async getInfos(@Req() request: Request): Promise<User> {
    return await this.usersService.getInfos(request.user);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() authLoginDto: AuthLoginDto,
  ): Promise<{ token: string; user: User }> {
    return await this.usersService.login(authLoginDto);
  }
}
