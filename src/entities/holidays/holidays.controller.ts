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

import { HolidaysService } from './holidays.service';
import { CreateHolidayDto } from './dto/createHoliday.dto';
import { UpdateHolidayDto } from './dto/updateHoliday.dto';
import { Holiday } from './holiday.schema';

@ApiBearerAuth('BearerToken')
@ApiTags('holidays')
@Controller('holidays')
export class HolidaysController {
  constructor(private readonly holidaysService: HolidaysService) {}

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Take a vacation' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Holiday successfully taked',
    type: Holiday,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators**, **Managers** and **Educators** can take vacations',
  })
  @Post()
  async create(@Body() createHolidayDto: CreateHolidayDto): Promise<Holiday> {
    return await this.holidaysService.create(createHolidayDto);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find employee holidays' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of employee holidays',
    type: [Holiday],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Clients** not allowed to find all employee holidays',
  })
  @ApiQuery({
    name: 'employeeId',
    type: String,
    required: false,
  })
  @Get()
  async find(@Query('employeeId') employeeId?: string): Promise<Holiday[]> {
    return await this.holidaysService.find(employeeId);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a holiday' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found holiday',
    type: Holiday,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Clients** not allowed to find an employee holiday',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':holidayId')
  async findOne(@Param('holidayId') holidayId: string): Promise<Holiday> {
    return await this.holidaysService.findOne(holidayId);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER, Role.EDUCATOR)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a holiday' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified holiday',
    type: Holiday,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '**Client** not allowed to modify a holiday',
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  @Put(':holidayId')
  async updateOne(
    @Param('holidayId') holidayId: string,
    @Body() updateHolidayDto: UpdateHolidayDto,
  ): Promise<Holiday> {
    return await this.holidaysService.updateOne(holidayId, updateHolidayDto);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a holiday' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted holiday',
    type: Holiday,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a holiday',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':holidayId')
  async deleteOne(@Param('holidayId') holidayId: string): Promise<Holiday> {
    return await this.holidaysService.deleteOne(holidayId);
  }
}
