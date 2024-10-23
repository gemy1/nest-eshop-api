import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user) {
      throw new UnauthorizedException();
    }

    if (!roles.includes(user.role)) {
      throw new UnauthorizedException('You Are Not Authorized');
    }

    return true;
  }
}
