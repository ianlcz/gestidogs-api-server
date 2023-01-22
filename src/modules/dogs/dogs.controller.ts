import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request } from 'express';

import { Dog } from './dog.schema';
import { DogsService } from './dogs.service';
import { DogDto } from './dto/dog.dto';

import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

import { Roles } from '../../decorators/roles.decorator';
import { Role } from '../../enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
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
  async create(@Body() dogDto: DogDto): Promise<Dog> {
    return await this.dogsService.create(dogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Find all dogs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of dogs',
    type: [Dog],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can find all dogs',
  })
  @Get()
  async findAll(): Promise<Dog[]> {
    return await this.dogsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Find dogs by owner' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of dogs by their owner',
    type: [Dog],
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Managers** can find dogs by their owner',
  })
  @Get('/owner/:ownerId')
  async findByOwner(@Param('ownerId') ownerId: string): Promise<Dog[]> {
    return await this.dogsService.findByOwner(ownerId);
  }
}
