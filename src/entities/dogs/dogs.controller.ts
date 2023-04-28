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
  Req,
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

import { Request, Response } from 'express';

import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';
import { RolesGuard } from '../../guards/roles.guard';
import { AccessTokenGuard } from '../../guards/accessToken.guard';

import { CreateDogDto } from './dto/createDog.dto';
import { UpdateDogDto } from './dto/updateDog.dto';
import { Dog } from './dog.schema';
import { DogsService } from './dogs.service';

@ApiBearerAuth('BearerToken')
@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Create a dog' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Dog successfully created',
    type: Dog,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can create a new dog',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable Entity',
  })
  @Post()
  async create(@Body() createDogDto: CreateDogDto): Promise<Dog> {
    return await this.dogsService.create(createDogDto);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find dogs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of dogs',
    type: [Dog],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can find dogs',
  })
  @ApiQuery({
    name: 'ownerId',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'establishmentId',
    type: String,
    required: false,
  })
  @Get()
  async find(
    @Query('ownerId') ownerId?: string,
    @Query('establishmentId') establishmentId?: string,
  ): Promise<Dog[]> {
    return await this.dogsService.find(ownerId, establishmentId);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Find a dog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The found dog',
    type: Dog,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized if the **Client** is not the owner of the dog',
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not found' })
  @Get(':dogId')
  async findOne(
    @Param('dogId') dogId: string,
    @Req() req: Request,
  ): Promise<Dog> {
    return await this.dogsService.findOne(dogId, req.user);
  }

  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Update a dog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The modified dog',
    type: Dog,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Unauthorized if the **Client** is not the owner of the dog',
  })
  @ApiResponse({
    status: HttpStatus.NOT_MODIFIED,
    description: 'Not Modified',
  })
  @Put(':dogId')
  async updateOne(
    @Param('dogId') dogId: string,
    @Body() updateDogDto: UpdateDogDto,
    @Req() req: Request,
  ): Promise<Dog> {
    return await this.dogsService.updateOne(dogId, updateDogDto, req.user);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a dog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted dog',
    type: Dog,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete a dog',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':dogId')
  async deleteOne(@Param('dogId') dogId: string): Promise<Dog> {
    return await this.dogsService.deleteOne(dogId);
  }

  @Roles(Role.ADMINISTRATOR, Role.MANAGER)
  @UseGuards(AccessTokenGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete dogs by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Dogs successfully deleted',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can delete dogs based on their owner',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @ApiQuery({
    name: 'ownerId',
    type: String,
    required: true,
  })
  @Delete('/')
  async deleteByOwner(
    @Query('ownerId') ownerId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.dogsService.deleteByOwner(ownerId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete dogs successfully',
    });
  }
}
