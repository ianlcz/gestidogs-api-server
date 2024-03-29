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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Response } from 'express';

import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums/role.enum';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';

import { SessionsService } from '../services/sessions.service';
import { Session } from '../schemas/session.schema';

import { CreateSessionDto } from '../dtos/createSession.dto';
import { WriteReportDto } from '../dtos/writeReport.dto';
import { UpdateSessionDto } from '../dtos/updateSession.dto';

@ApiBearerAuth('BearerToken')
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Write a session report' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successfully written session report',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can write a session report',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post('/:sessionId/report')
  async writeReport(
    @Param('sessionId') sessionId: string,
    @Body() writeReportDto: WriteReportDto,
  ): Promise<Session> {
    return await this.sessionsService.writeReport(sessionId, writeReportDto);
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of sessions',
    type: [Session],
  })
  @ApiQuery({
    name: 'reserved',
    type: Boolean,
    required: false,
  })
  @ApiQuery({
    name: 'educatorId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'activityId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'establishmentId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'begin',
    type: Date,
    required: false,
  })
  @ApiQuery({
    name: 'end',
    type: Date,
    required: false,
  })
  @Get()
  async find(
    @Query('reserved') reserved?: boolean,
    @Query('educatorId') educatorId?: string,
    @Query('activityId') activityId?: string,
    @Query('establishmentId') establishmentId?: string,
    @Query('begin') begin?: Date,
    @Query('end') end?: Date,
  ): Promise<Session[]> {
    if (establishmentId) {
      if (reserved && begin instanceof Date && isFinite(begin.getTime())) {
        return await this.sessionsService.findByEstablishment(
          establishmentId,
          begin,
          true,
        );
      } else {
        return await this.sessionsService.findByEstablishment(establishmentId);
      }
    } else {
      return await this.sessionsService.find(
        reserved,
        educatorId,
        activityId,
        establishmentId,
        begin,
        end,
      );
    }
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a daily sessions' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found daily sessions',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can write a session report',
  })
  @ApiBadRequestResponse()
  @ApiQuery({
    name: 'date',
    type: Date,
    required: true,
  })
  @ApiQuery({
    name: 'establishmentId',
    type: String,
    required: false,
  })
  @Get('daily')
  async findDaily(
    @Query('date') date: Date,
    @Query('establishmentId') establishmentId?: string,
  ): Promise<{
    today: Session[];
    next: Session[];
  }> {
    return await this.sessionsService.findDaily(date, establishmentId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find daily sessions by dog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found daily sessions',
  })
  @ApiBadRequestResponse()
  @ApiQuery({
    name: 'date',
    type: Date,
    required: true,
  })
  @Get('daily/:dogId')
  async findByDogAndDate(
    @Param('dogId') dogId: string,
    @Query('date') date: Date,
  ) {
    return await this.sessionsService.findByDogAndDate(dogId, date);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a session' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found session',
    type: Session,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Session not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get(':sessionId')
  async findOne(@Param('sessionId') sessionId: string): Promise<Session> {
    return await this.sessionsService.findOne(sessionId);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    status: HttpStatus.NOT_FOUND,
    description: 'Session to modify not found',
  })
  @ApiBadRequestResponse()
  @Put(':sessionId')
  async updateOne(
    @Param('sessionId') sessionId: string,
    @Body() updateSessionDto: UpdateSessionDto,
  ) {
    return await this.sessionsService.updateOne(sessionId, updateSessionDto);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    description: 'Session to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete(':sessionId')
  async deleteOne(@Param('sessionId') sessionId: string): Promise<Session> {
    return await this.sessionsService.deleteOne(sessionId);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    description: 'Sessions to delete not found',
  })
  @ApiBadRequestResponse()
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete sessions by activity' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Sessions successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a session',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Sessions to delete not found',
  })
  @ApiBadRequestResponse()
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
