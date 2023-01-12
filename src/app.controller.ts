import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get API informations' })
  @ApiResponse({
    status: 200,
    description: 'The GestiDogs API informations',
  })
  initApp(): {
    app: { name: string; github: string };
    developpers: { name: string; github: string }[];
  } {
    return this.appService.initApp();
  }
}
