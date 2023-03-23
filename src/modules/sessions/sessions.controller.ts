import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';

import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateSessionDto } from './dto/createSession.dto';
import { UpdateSessionDto } from './dto/updateSession.dto';
import { Session } from './session.schema';
import { SessionsService } from './sessions.service';

type sessionEducatorType = { today: Session[]; next: Session[] } | Session[];

@ApiBearerAuth('BearerToken')
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @ApiOperation({ summary: 'Create a session' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Session successfully created',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can create a new session',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(@Body() createSessionDto: CreateSessionDto): Promise<Session> {
    return await this.sessionsService.create(createSessionDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Find all sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sessions',
    type: [Session],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all sessions',
  })
  @Get()
  async findAll(): Promise<Session[]> {
    return await this.sessionsService.findAll();
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found session',
    type: Session,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':sessionId')
  async findOne(@Param('sessionId') sessionId: string): Promise<Session> {
    return await this.sessionsService.findOne(sessionId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find sessions by educator' })
  @ApiQuery({
    name: 'date',
    type: Date,
    required: false,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sessions by their educator',
    type: [Session],
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get('/educators/:educatorId')
  async findByEducator(
    @Param('educatorId') educatorId: string,
    @Query('date') date?: Date,
  ): Promise<sessionEducatorType> {
    return date instanceof Date && isFinite(date.getTime())
      ? await this.sessionsService.findEducatorSessionsByDate(educatorId, date)
      : await this.sessionsService.findByEducator(educatorId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find sessions by activity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sessions by activity',
    type: [Session],
  })
  @Get('/activities/:activityId')
  async findByActivity(
    @Param('activityId') activityId: string,
  ): Promise<Session[]> {
    return await this.sessionsService.findByActivity(activityId);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find session by establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sessions by establishments',
    type: [Session],
  })
  @Get('establishments/:establishmentId')
  async findByEstablishment(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Session[]> {
    return await this.sessionsService.findByEstablishment(establishmentId);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @ApiOperation({ summary: 'Find number of places left in a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Number of places remaining in a session',
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can find number of places left in a session',
  })
  @Get(':sessionId/remaining-places')
  async findPlacesLeft(@Param('sessionId') sessionId: string): Promise<number> {
    return await this.sessionsService.findPlacesLeft(sessionId);
  }

  @ApiOperation({ summary: 'Find reserved sessions by establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reserved sessions by establishments',
    type: [Session],
  })
  @Get('establishments/:establishmentId/reserved')
  async findReservedByEstablishment(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Session[]> {
    return await this.sessionsService.findByEstablishment(
      establishmentId,
      true,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @ApiOperation({ summary: 'Update a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified session',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Client** not allowed to modify a session',
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  @Put(':sessionId')
  async updateOne(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return await this.sessionsService.updateOne(sessionId, updateSessionDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Remove all sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all sessions',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can remove all sessions',
  })
  @Delete()
  async deleteAll(@Res() response: Response): Promise<void> {
    await this.sessionsService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'sessions' Collection`,
    });
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @ApiOperation({ summary: 'Delete a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted session',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':sessionId')
  async deleteOne(@Param('sessionId') sessionId: string): Promise<Session> {
    return await this.sessionsService.deleteOne(sessionId);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @ApiOperation({ summary: 'Delete sessions by educator' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can delete a session',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete('/educators/:educatorId')
  async deleteByEducator(
    @Param('educatorId') educatorId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.sessionsService.deleteByEducator(educatorId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete sessions successfully',
    });
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Delete sessions by activity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sessions successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a session',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete('/activities/:activityId')
  async deleteByActivity(
    @Param('activityId') activityId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.sessionsService.deleteByActivity(activityId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete sessions successfully',
    });
  }
}
