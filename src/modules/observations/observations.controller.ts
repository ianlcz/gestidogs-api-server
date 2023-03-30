import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateObservationDto } from './dto/createObservation.dto';
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
  @Roles(Role.ADMINISTRATOR)
  @ApiOperation({ summary: 'Find all dog observations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of observations',
    type: [Observation],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all observations',
  })
  @Get()
  async findAll(): Promise<Observation[]> {
    return await this.observationsService.findAll();
  }
}
