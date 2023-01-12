import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  initApp(): {
    app: { name: string; github: string };
    developpers: { name: string; github: string }[];
  } {
    return {
      app: {
        name: 'Gestidogs - API Server',
        github: 'https://github.com/ianlcz/gestidogs-api-server',
      },
      developpers: [
        { name: 'Yann LE COZ', github: 'https://github.com/ianlcz' },
      ],
    };
  }
}
