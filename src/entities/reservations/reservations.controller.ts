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

import { CreateReservationDto } from './dto/createReservation.dto';
import { UpdateReservationDto } from './dto/updateReservation.dto';
import { Reservation } from './reservation.schema';
import { ReservationsService } from './reservations.service';

@ApiBearerAuth('BearerToken')
@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a reservation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reservation successfully created',
    type: Reservation,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationsService.create(createReservationDto);
  }

  /* @Roles(Role.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find all reservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reservations',
    type: [Reservation],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all reservations',
  })
  @Get()
  async findAll(): Promise<Reservation[]> {
    return await this.reservationsService.findAll();
  } */

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find reservations' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reservations',
    type: [Reservation],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can find reservations',
  })
  @ApiQuery({
    name: 'sessionId',
    type: String,
    required: false,
  })
  @Get()
  async find(@Query('sessionId') sessionId?: string): Promise<Reservation[]> {
    return await this.reservationsService.find(sessionId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a reservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found reservation',
    type: Reservation,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':reservationId')
  async findOne(
    @Param('reservationId') reservationId: string,
  ): Promise<Reservation> {
    return await this.reservationsService.findOne(reservationId);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a reservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified reservation',
    type: Reservation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Client** not allowed to modify a reservation',
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  @Put(':reservationId')
  async updateOne(
    @Param('reservationId') reservationId: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<Reservation> {
    return await this.reservationsService.updateOne(
      reservationId,
      updateReservationDto,
    );
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted reservation',
    type: Reservation,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a reservation',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':reservationId')
  async deleteOne(
    @Param('reservationId') reservationId: string,
  ): Promise<Reservation> {
    return await this.reservationsService.deleteOne(reservationId);
  }
}