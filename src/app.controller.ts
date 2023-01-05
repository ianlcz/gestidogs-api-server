import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  initApp(): {
    appName: string;
    developpers: { name: string; githubProfile: string }[];
  } {
    return this.appService.initApp();
  }
}
