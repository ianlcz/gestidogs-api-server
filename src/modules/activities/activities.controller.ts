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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../decorators/roles.decorator';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { Activity } from './activity.schema';

import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';

import { Role } from '../../enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @UseGuards(AccessTokenGuard)
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

  /*@UseGuards(AccessTokenGuard)
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
  }*/

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find activities of an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of activities of an establishment',
    type: [Activity],
  })
  @ApiQuery({
    name: 'establishmentId',
    type: String,
    required: true,
  })
  @Get()
  async findByEstablishment(
    @Query('establishmentId') establishmentId: string,
  ): Promise<Activity[]> {
    return await this.activitiesService.findByEstablishment(establishmentId);
  }

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
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
