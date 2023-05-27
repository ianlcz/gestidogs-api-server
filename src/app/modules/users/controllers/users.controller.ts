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
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
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

  @ApiOperation({
    summary: 'Register a user',
    description:
      "Create a new user account within GestiDogs application. It allows users to register and gain access to the application's features and resources.",
  })
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
  @ApiOperation({
    summary: 'Login a user',
    description:
      "Authenticate a user and obtain an access token for subsequent API requests. It handles the login process by verifying the user's credentials.",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @Post('login')
  async login(@Body() authLoginDto: AuthLoginDto) {
    return await this.usersService.login(authLoginDto);
  }

  @UseGuards(AccessTokenGuard)
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully logged out',
  })
  @ApiOperation({
    summary: 'Logout a user',
    description:
      "Log out a currently authenticated user. It invalidates the user's access token, effectively terminating their session.",
  })
  @Post('logout')
  logout(@Req() req: Request) {
    this.usersService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Refresh a user',
    description:
      'Refresh an access token for an authenticated user. This route is typically used when an access token is about to expire or has expired, and the user needs to obtain a new valid access token to continue accessing protected resources.',
  })
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

  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Get user logged informations',
    description:
      'Retrieve information about the currently authenticated user. It allows users to access their own user profile or retrieve relevant data associated with their account.',
  })
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
  @ApiOperation({
    summary: 'Find users',
    description:
      'Retrieve a list of users from the GestiDogs application. It allows administrator and manager users to view and retrieve information about all users in the application.',
  })
  @ApiQuery({
    name: 'establishmentId',
    description: 'Unique id of an establishment',
    example: '64046ee9b75c105a1d7e7fe3',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'role',
    description: 'Role of logged-in user',
    enum: RoleType,
    required: false,
  })
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

  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Find a user',
    description:
      'Retrieve information about a specific user. It allows users to fetch the details of a particular user by specifying their unique `userId` parameter in the route.',
  })
  @ApiQuery({
    name: 'userId',
    description:
      'Unique user id that corresponds to the user you want to retrieve information',
    example: '63cc452807b1d06248d742e0',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found user',
    type: User,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found' })
  @Get(':userId')
  async findOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.findOne(userId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({
    summary: 'Update user informations',
    description:
      "Edit information for a specific user. It allows users to modify the details or attributes of a particular user's account by specifying their unique `userId` parameter in the route.",
  })
  @ApiQuery({
    name: 'userId',
    description:
      'Unique user id that corresponds to the user you want to edit information',
    example: '63cc452807b1d06248d742e0',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified user',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @Put(':userId')
  async updateOne(
    @Param('userId') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.updateOne(userId, updateUserDto);
  }

  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({
    summary: 'Delete a user',
    description:
      "Delete a specific user from the GestiDogs application. It allows only administrator users to remove a particular user's account and associated data by specifying their unique `userId` parameter in the route.",
  })
  @ApiQuery({
    name: 'userId',
    description:
      'Unique user id that corresponds to the user you want to delete from the application',
    example: '63cc452807b1d06248d742e0',
    type: String,
    required: true,
  })
  @ApiResponse({
    status: HttpStatus.OK,
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
    description: 'Not found',
  })
  @Delete(':userId')
  async deleteOne(@Param('userId') userId: string): Promise<User> {
    return await this.usersService.deleteOne(userId);
  }
}
