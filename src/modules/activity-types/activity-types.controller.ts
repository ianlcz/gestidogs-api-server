import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ActivityTypesService } from './activity-types.service';

@ApiTags('activity-types')
@Controller('activity-types')
export class ActivityTypesController {
  constructor(private readonly activityTypesService: ActivityTypesService) {}
}
