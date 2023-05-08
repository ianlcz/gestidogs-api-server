import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '../modules/users/schemas/user.schema';

import { RoleType } from '../enums/Role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const requiredRoles: RoleType[] = this.reflector.getAllAndOverride<
      RoleType[]
    >('roles', [context.getHandler(), context.getClass()]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest<{ user: User }>();

    if (requiredRoles.some((role: RoleType) => user.role.includes(role))) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}
