import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../enums/role.enum';

export const Roles = (...roles: RoleType[]) => SetMetadata('roles', roles);
