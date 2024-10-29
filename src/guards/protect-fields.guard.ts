import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export class ProtectFieldsGuard implements CanActivate {
  constructor(private fields: string[]) {}

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    const user = request.currentUser;
    if (user.role === 'admin') {
      return true;
    }

    this.fields.forEach((field) => {
      if (field in request.body) {
        throw new UnauthorizedException(
          'you are not authorized to update some fields',
        );
      }
    });

    return true;
  }
}
