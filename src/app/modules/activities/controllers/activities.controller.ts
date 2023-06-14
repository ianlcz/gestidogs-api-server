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
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { Roles } from '../../../common/decorators/roles.decorator';
import { RoleType } from '../../../common/enums/role.enum';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { AccessTokenGuard } from '../../../common/guards/accessToken.guard';

import { Activity } from '../schemas/activity.schema';

import { ActivitiesService } from '../services/activities.service';
import { CreateActivityDto } from '../dtos/createActivity.dto';
import { UpdateActivityDto } from '../dtos/updateActivity.dto';

@ApiBearerAuth('BearerToken')
@ApiTags('activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Activity not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
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
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Activity to modify not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete an activity' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
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
    description: 'Activity to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete(':activityId')
  async deleteOne(@Param('activityId') activityId: string): Promise<Activity> {
    return await this.activitiesService.deleteOne(activityId);
  }
}
