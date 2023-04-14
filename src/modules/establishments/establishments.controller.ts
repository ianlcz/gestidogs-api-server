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
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Response } from 'express';

import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateEstablishmentDto } from './dto/createEstablishment.dto';
import { UpdateEstablishmentDto } from './dto/updateEstablishment.dto';
import { Establishment } from './establishment.schema';
import { EstablishmentsService } from './establishments.service';

import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

import { User } from '../users/user.schema';

@ApiBearerAuth('BearerToken')
@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Create an establishment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Establishment successfully created',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can create a new establishment',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(
    @Body() createEstablishmentDto: CreateEstablishmentDto,
  ): Promise<Establishment> {
    return await this.establishmentsService.create(createEstablishmentDto);
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @ApiOperation({ summary: 'Add a new employee in establishment' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Establishment employees',
    type: [User],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can add a new employee',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @Post(':establishmentId/employees/:newEmployeeId')
  async addEmployee(
    @Param('establishmentId') establishmentId: string,
    @Param('newEmployeeId') newEmployeeId: string,
  ): Promise<User[]> {
    return await this.establishmentsService.addEmployee(
      establishmentId,
      newEmployeeId,
    );
  }

  @UseGuards(AccessTokenGuard)
  @ApiOperation({ summary: 'Find establishments' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of establishments',
    type: [Establishment],
  })
  @ApiQuery({
    name: 'ownerId',
    type: String,
    required: false,
  })
  @Get()
  async find(@Query('ownerId') ownerId?: string): Promise<Establishment[]> {
    return await this.establishmentsService.find(ownerId);
  }

  @UseGuards(AccessTokenGuard)
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

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
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
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
  })
  @Put(':establishmentId')
  async updateOne(
    @Param('establishmentId') establishmentId: string,
    @Body() updateEstablishmentDto: UpdateEstablishmentDto,
  ): Promise<Establishment> {
    return await this.establishmentsService.updateOne(
      establishmentId,
      updateEstablishmentDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR)
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

  @UseGuards(AccessTokenGuard)
  @Roles(Role.ADMINISTRATOR)
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
  @Delete('/owners/:ownerId')
  async deleteByOwner(
    @Param('ownerId') ownerId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.establishmentsService.deleteByOwner(ownerId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete establishements successfully',
    });
  }
}
