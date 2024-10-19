import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.getTokenFromRequest(request);

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }

  private getTokenFromRequest(req: Request): string | undefined {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      return undefined;
    }

    return token;
  }
}
