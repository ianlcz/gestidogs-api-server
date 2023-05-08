import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../enums/Role.enum';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
