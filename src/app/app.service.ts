import { Injectable } from '@nestjs/common';
import * as packageJSON from 'package.json';

@Injectable()
export class AppService {
  initApp(): {
    app: { name: string; version: string; github: string };
    developpers: { name: string; github: string }[];
  } {
    return {
      app: {
        name: 'Gestidogs API Server',
        version: packageJSON.version,
        github: 'https://github.com/ianlcz/gestidogs-api-server',
      },
      developpers: [
        {
          name: 'Mathieu CHAMBAUD',
          github: 'https://github.com/FrekiManagarm',
        },
        {
          name: 'Dorian FRANÇAIS',
          github: 'https://github.com/DorianFRANCAIS',
        },
        { name: 'Yann LE COZ', github: 'https://github.com/ianlcz' },
      ],
    };
  }
}
