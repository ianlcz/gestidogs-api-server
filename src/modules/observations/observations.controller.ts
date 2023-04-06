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
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateObservationDto } from './dto/createObservation.dto';
import { UpdateObservationDto } from './dto/updateObservation.dto';
import { Observation } from './observation.schema';
import { ObservationsService } from './observations.service';

@ApiBearerAuth('BearerToken')
@ApiTags('observations')
@Controller('observations')
export class ObservationsController {
  constructor(private readonly observationsService: ObservationsService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find a dog observation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found dog observation',
    type: Observation,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':observationId')
  async findOne(
    @Param('observationId') observationId: string,
  ): Promise<Observation> {
    return await this.observationsService.findOne(observationId);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
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
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
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

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Delete a dog observation' })
  @ApiResponse({
    status: HttpStatus.OK,
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
    description: 'Not found',
  })
  @Delete(':observationId')
  async deleteOne(
    @Param('observationId') observationId: string,
  ): Promise<Observation> {
    return await this.observationsService.deleteOne(observationId);
  }
}
