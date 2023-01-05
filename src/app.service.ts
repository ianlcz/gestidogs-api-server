import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  initApp(): {
    appName: string;
    developpers: { name: string; githubProfile: string }[];
  } {
    return {
      appName: 'Gestidogs - API Server',
      developpers: [
        { name: 'Yann LE COZ', githubProfile: 'https://github.com/ianlcz' },
      ],
    };
  }
}
