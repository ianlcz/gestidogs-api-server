import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthLoginDto } from './dto/authLogin.dto';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<User> {
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
