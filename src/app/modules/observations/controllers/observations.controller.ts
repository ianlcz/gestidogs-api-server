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

import { CreateObservationDto } from '../dtos/createObservation.dto';
import { UpdateObservationDto } from '../dtos/updateObservation.dto';
import { Observation } from '../schemas/observation.schema';
import { ObservationsService } from '../services/observations.service';

@ApiBearerAuth('BearerToken')
@ApiTags('observations')
@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a dog observation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Observation successfully created',
    type: Observation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Client** not allowed to create a dog observation',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(
    @Body() createObservationDto: CreateObservationDto,
  ): Promise<Observation> {
    return await this.observationsService.create(createObservationDto);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find all dog observations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of all dog observations',
    type: [Observation],
  })
  @ApiQuery({
    name: 'dogId',
    type: String,
    required: false,
  })
  @Get()
  async find(@Query('dogId') dogId?: string): Promise<Observation[]> {
    return await this.observationsService.find(dogId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a dog observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found dog observation',
    type: Observation,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Observation not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get(':observationId')
  async findOne(
    @Param('observationId') observationId: string,
  ): Promise<Observation> {
    return await this.observationsService.findOne(observationId);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER, RoleType.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a dog observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified dog observation',
    type: Observation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Client** not allowed to modify a dog observation',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Observation to modified not found',
  })
  @ApiBadRequestResponse()
  @Put(':observationId')
  async updateOne(
    @Param('observationId') observationId: string,
    @Body() updateObservationDto: UpdateObservationDto,
  ): Promise<Observation> {
    return await this.observationsService.updateOne(
      observationId,
      updateObservationDto,
    );
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a dog observation' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The deleted dog observation',
    type: Observation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a dog observation',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Observation to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete(':observationId')
  async deleteOne(
    @Param('observationId') observationId: string,
  ): Promise<Observation> {
    return await this.observationsService.deleteOne(observationId);
  }
}
