import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ownershipCheck: boolean = this.reflector.getAllAndOverride(
      'ownershipCheck',
      [context.getClass(), context.getHandler()],
    );
    if (!ownershipCheck) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();
    const user = request.currentUser;

    if (!user) {
      throw new UnauthorizedException('You are not authorized');
    }
    if (user.role === 'admin') return true;

    const resourceId = request.params.id;
    const controllerName = context.getClass().name;

    let resource;

    switch (controllerName) {
      case 'UsersController':
        try {
          resource = await this.userService.findOneById(parseInt(resourceId));
          if (resource.id === user.id) {
            return true;
          }
        } catch {
          return false;
        }
    }

    return false;
  }
}
