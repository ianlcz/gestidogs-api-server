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
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EstablishmentDto } from './dto/establishment.dto';
import { Establishment } from './establishment.schema';
import { EstablishmentsService } from './establishments.service';

@Controller('establishments')
@ApiBearerAuth()
@ApiTags('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create an establishment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Establishment successfully created',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  async create(
    @Body() establishmentDto: EstablishmentDto,
  ): Promise<Establishment> {
    return await this.establishmentsService.create(establishmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Find all establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of establishments',
    type: [Establishment],
  })
  async findAll(): Promise<Establishment[]> {
    return await this.establishmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':establishmentId')
  @ApiOperation({ summary: 'Find an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found establishment',
    type: Establishment,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  async findOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.findOne(establishmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/owner/:ownerId')
  @ApiOperation({ summary: 'Find establishments by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of owner-managed establishments',
    type: [Establishment],
  })
  async findByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<Establishment[]> {
    return await this.establishmentsService.findByOwner(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':establishmentId')
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified establishment',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  async updateOne(
    @Param('establishmentId') establishmentId: string,
    @Body() establishmentDto: EstablishmentDto,
  ) {
    return await this.establishmentsService.updateOne(
      establishmentId,
      establishmentDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  @ApiOperation({ summary: 'Remove all establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all establishments',
  })
  async deleteAll(@Res() response: Response) {
    await this.establishmentsService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'establishments' Collection`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':establishmentId')
  @ApiOperation({ summary: 'Delete an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted establishment',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  async deleteOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.deleteOne(establishmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/owner/:ownerId')
  @ApiOperation({ summary: 'Delete establishments by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Establishments successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  async deleteByOwner(
    @Param('ownerId') ownerId: string,
    @Res() response: Response,
  ) {
    await this.establishmentsService.deleteByOwner(ownerId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete establishements successfully',
    });
  }
}
