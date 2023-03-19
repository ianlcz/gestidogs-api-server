import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { CreateReservationDto } from './dto/createReservation.dto';
import { Reservation } from './reservation.schema';
import { ReservationsService } from './reservations.service';

@ApiBearerAuth('BearerToken')
@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(AccessTokenGuard)
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
}
