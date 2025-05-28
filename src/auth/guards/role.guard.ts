import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@src/user/types/role.types';
import { Request } from 'express';
import { AuthForbiddenException } from '../helpers/auth.exception';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedRoles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);
    if (!allowedRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (this.matchRoles(allowedRoles, user.role)) return true;

    throw new AuthForbiddenException({ role: user.role, requiredRoles: allowedRoles.join(', ') });
  }

  private matchRoles(allowedRoles: Role[], userRole: Role): boolean {
    if (userRole === Role.ADMIN) return true;

    const rolesHierarchy = {
      [Role.BUSINESS_MAN]: [Role.BUSINESS_MAN],
      [Role.INVESTOR]: [Role.INVESTOR, Role.BUSINESS_MAN],
    };

    return allowedRoles.some((allowedRole) => Object.values(rolesHierarchy[userRole]).includes(allowedRole));
  }
}
