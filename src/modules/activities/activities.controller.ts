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
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { Activity } from './activity.schema';

import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/createActivity.dto';
import { UpdateActivityDto } from './dto/updateActivity.dto';

@ApiBearerAuth('BearerToken')
@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find activities' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of activities',
    type: [Activity],
  })
  @ApiQuery({
    name: 'establishmentId',
    type: String,
    required: false,
  })
  @Get()
  async find(
    @Query('establishmentId') establishmentId?: string,
  ): Promise<Activity[]> {
    return await this.activitiesService.find(establishmentId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
