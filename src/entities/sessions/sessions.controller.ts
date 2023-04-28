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
import { RolesGuard } from '../../guards/roles.guard';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateSessionDto } from './dto/createSession.dto';
import { UpdateSessionDto } from './dto/updateSession.dto';
import { WriteReportDto } from './dto/writeReport.dto';

import { Session } from './session.schema';
import { SessionsService } from './sessions.service';

@ApiBearerAuth('BearerToken')
@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @ApiQuery({
    name: 'date',
    type: Date,
    required: false,
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
  @Get()
  async find(
    @Query('date') date?: Date,
    @Query('reserved') reserved?: boolean,
    @Query('educatorId') educatorId?: string,
    @Query('activityId') activityId?: string,
    @Query('establishmentId') establishmentId?: string,
  ): Promise<
    | Session[]
    | {
        today: Session[];
        next: Session[];
      }
  > {
    if (educatorId) {
      if (date instanceof Date && isFinite(date.getTime())) {
        return await this.sessionsService.findEducatorSessionsByDate(
          educatorId,
          date,
        );
      } else {
        return await this.sessionsService.findByEducator(educatorId);
      }
    } else if (activityId) {
      return await this.sessionsService.findByActivity(activityId);
    } else if (establishmentId) {
      if (reserved && date instanceof Date && isFinite(date.getTime())) {
        return await this.sessionsService.findByEstablishment(
          establishmentId,
          date,
          true,
        );
      } else {
        return await this.sessionsService.findByEstablishment(establishmentId);
      }
    } else {
      return await this.sessionsService.findAll();
    }
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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
    description: 'Not found',
  })
  @Delete(':sessionId')
  async deleteOne(@Param('sessionId') sessionId: string): Promise<Session> {
    return await this.sessionsService.deleteOne(sessionId);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
