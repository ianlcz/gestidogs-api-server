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
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Request } from 'express';

import { AuthLoginDto } from '../dtos/authLogin.dto';
import { CreateUserDto } from '../dtos/createUser.dto';
import { UpdateUserDto } from '../dtos/updateUser.dto';

import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums/role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../../../common/guards/refreshToken.guard';

import { User } from '../schemas/user.schema';
import { UsersService } from '../services/users.service';

@ApiBearerAuth('BearerToken')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Register a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<{
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
    user: User;
  }> {
    return await this.usersService.register(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged',
  })
  @ApiBadRequestResponse()
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.usersService.login(authLoginDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Logout a user' })
  @Post('logout')
  logout(@Req() req: Request) {
    this.usersService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Refresh a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Refresh User',
  })
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.usersService.refreshTokens(userId, refreshToken);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Get user logged informations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The logged user',
    type: User,
  })
  @Get('me')
  async getInfos(@Req() request: Request): Promise<User> {
    return await this.usersService.getInfos(request.user);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find users' })
  @ApiQuery({ name: 'establishmentId', type: String, required: false })
  @ApiQuery({ name: 'role', enum: RoleType, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of users',
    type: [User],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can find users',
  })
  @Get()
  async find(
    @Query('establishmentId') establishmentId?: string,
    @Query('role') role?: RoleType,
  ): Promise<User[]> {
    return await this.usersService.find(establishmentId, role);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully found',
    type: User,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found' })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Update user informations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified user',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User to modify not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Put(':userId')
  async updateOne(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOne(userId, updateUserDto);
  }

  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The deleted user',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can delete a user',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'User to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete(':userId')
  async deleteOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.deleteOne(userId);
  }
}
