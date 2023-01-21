import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Dog } from './dog.schema';
import { DogsService } from './dogs.service';
import { DogDto } from './dto/dog.dto';

import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';

@ApiBearerAuth('BearerToken')
@ApiTags('dogs')
@Controller('dogs')
export class DogsController {
  constructor(private readonly dogsService: DogsService) {}

  @ApiOperation({ summary: 'Create a dog' })
  @Roles(Role.ADMIN, Role.MANAGER)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Establishment successfully created',
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
}
