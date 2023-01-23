import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Request, Response } from 'express';

import { CreateDogDto } from './dto/createDog.dto';
import { UpdateDogDto } from './dto/updateDog.dto';
import { Dog } from './dog.schema';
import { DogsService } from './dogs.service';

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
  async create(@Body() createDogDto: CreateDogDto): Promise<Dog> {
    return await this.dogsService.create(createDogDto);
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

  @UseGuards(JwtAuthGuard)
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
  @Put('/:dogId')
  async ApiUnsupportedMediaTypeResponse(
    @Param('dogId') dogId: string,
    @Body() updateDogDto: UpdateDogDto,
    @Req() req: Request,
  ): Promise<Dog> {
    return await this.dogsService.updateOne(dogId, updateDogDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remove all dogs' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Remove all dogs',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** can remove all dogs',
  })
  @Delete()
  async deleteAll(@Res() response: Response): Promise<void> {
    await this.dogsService.deleteAll();

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: `Delete all documents in 'dogs' Collection`,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiOperation({ summary: 'Delete a dog' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The deleted dog',
    type: Dog,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description:
      'Unauthorized because only **Administrators** and **Manager** can delete a dog',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Not found',
  })
  @Delete(':dogId')
  async deleteOne(@Param('dogId') dogId: string): Promise<Dog> {
    return await this.dogsService.deleteOne(dogId);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.MANAGER)
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
  @Delete('/owner/:ownerId')
  async deleteByOwner(
    @Param('ownerId') ownerId: string,
    @Res() response: Response,
  ): Promise<void> {
    await this.dogsService.deleteByOwner(ownerId);

    response.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Delete dogs successfully',
    });
  }
}
