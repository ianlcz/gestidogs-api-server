import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

import { Activity } from './activity.schema';

import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';
import { Role } from 'src/enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Create an activity' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Activity successfully created',
    type: Activity,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can create an activity',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(
    @Body() createActivityDto: CreateActivityDto,
  ): Promise<Activity> {
    return await this.activitiesService.create(createActivityDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Find all activities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of activities',
    type: [Activity],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all activities',
  })
  @Get()
  async findAll(): Promise<Activity[]> {
    return await this.activitiesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find an activity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found activity',
    type: Activity,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':activityId')
  async findOne(@Param('activityId') activityId: string): Promise<Activity> {
    return await this.activitiesService.findOne(activityId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find activities of an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of activities of an establishment',
    type: [Activity],
  })
  @Get('/establishment/:establishmentId')
  async findByEstablishment(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Activity[]> {
    return await this.activitiesService.findByEstablishment(establishmentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update an activity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified activity',
    type: Activity,
  })
  @ApiResponse({ status: HttpStatus.NOT_MODIFIED, description: 'Not Modified' })
  @Put(':activityId')
  async updateOne(
    @Param('activityId') activityId: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ): Promise<Activity> {
    return await this.activitiesService.updateOne(
      activityId,
      updateActivityDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Remove all activities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all activities',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can remove all activities',
  })
  @Delete()
  async deleteAll(@Res() response: Response): Promise<void> {
    await this.activitiesService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'activities' Collection`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted activity',
    type: Activity,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete an activity',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':activityId')
  async deleteOne(@Param('activityId') activityId: string): Promise<Activity> {
    return await this.activitiesService.deleteOne(activityId);
  }
}
