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

import { CreateEstablishmentDto } from '../dtos/createEstablishment.dto';
import { UpdateEstablishmentDto } from '../dtos/updateEstablishment.dto';
import { Establishment } from '../schemas/establishment.schema';
import { EstablishmentsService } from '../services/establishments.service';

import { User } from '../../users/schemas/user.schema';
import { NewEmployeeDto } from '../../users/dtos/newEmployee.dto';

@ApiBearerAuth('BearerToken')
@ApiTags('establishments')
@Controller('establishments')
export class EstablishmentsController {
  constructor(private readonly establishmentsService: EstablishmentsService) {}

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    description: 'Employees of establishment not found',
  })
  @ApiBadRequestResponse()
  @Post(':establishmentId/newEmployee')
  async addEmployee(
    @Param('establishmentId') establishmentId: string,
    @Body() newEmployeeDto: NewEmployeeDto,
  ): Promise<User[]> {
    return await this.establishmentsService.addEmployee(
      establishmentId,
      newEmployeeDto,
    );
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
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

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find an establishment' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found establishment',
    type: Establishment,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Establishment not found',
  })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @Get(':establishmentId')
  async findOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.findOne(establishmentId);
  }

  @Roles(RoleType.ADMINISTRATOR, RoleType.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    status: HttpStatus.NOT_FOUND,
    description: 'Establishment to modify not found',
  })
  @ApiBadRequestResponse()
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

  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    description: 'Establishment to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete(':establishmentId')
  async deleteOne(
    @Param('establishmentId') establishmentId: string,
  ): Promise<Establishment> {
    return await this.establishmentsService.deleteOne(establishmentId);
  }

  @Roles(RoleType.ADMINISTRATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
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
    description: 'Establishments to delete not found',
  })
  @ApiBadRequestResponse()
  @Delete('/owners/:ownerId')
  async deleteByOwner(@Param('ownerId') ownerId: string): Promise<void> {
    await this.establishmentsService.deleteByOwner(ownerId);
  }
}
