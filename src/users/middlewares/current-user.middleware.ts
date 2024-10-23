import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { User } from '../entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users.service';

declare module 'express' {
  interface Request {
    currentUser?: User;
    token?: string;
  }
}
@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.getTokenFromRequest(req);

    if (!token) {
      req.currentUser = null;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
      req.currentUser = await this.usersService.findOneById(payload.id);
    } catch (error) {
      req.currentUser = null;
      req.token = error.message;
    }

    next();
  }

  private getTokenFromRequest(req: Request): string | undefined {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];

    if (type !== 'Bearer') {
      return undefined;
    }

    return token;
  }
}
