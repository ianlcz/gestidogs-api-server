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

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { EstablishmentDto } from './dto/establishment.dto';
import { Establishment } from './establishment.schema';
import { EstablishmentsService } from './establishments.service';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create an establishment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Establishment successfully created',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can create a new establishment',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(
    @Body() establishmentDto: EstablishmentDto,
  ): Promise<Establishment> {
    return await this.establishmentsService.create(establishmentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find all establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of establishments',
    type: [Establishment],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all establishments',
  })
  @Get()
  async findAll(): Promise<Establishment[]> {
    return await this.establishmentsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found establishment',
    type: Establishment,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':establishmentId')
  async findOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.findOne(establishmentId);
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Find establishments by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of owner-managed establishments',
    type: [Establishment],
  })
  @Get('/owner/:ownerId')
  async findByOwner(
    @Param('ownerId') ownerId: string,
  ): Promise<Establishment[]> {
    return await this.establishmentsService.findByOwner(ownerId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified establishment',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can modify an establishment',
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  @Put(':establishmentId')
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
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remove all establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all establishments',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can remove all establishments',
  })
  @Delete()
  async deleteAll(@Res() response: Response) {
    await this.establishmentsService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'establishments' Collection`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted establishment',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can delete an establishment',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':establishmentId')
  async deleteOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.deleteOne(establishmentId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete establishments by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Establishments successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can delete establishments based on their owner',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete('/owner/:ownerId')
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
