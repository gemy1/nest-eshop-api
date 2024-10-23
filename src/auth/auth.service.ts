import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IJwtPayload } from './interfaces/jwt.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(userDetails: CreateUserDto) {
    const { email, password } = userDetails;

    const existingUser = await this.userService.findOneByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await this.hashData(password);

    userDetails.password = hashedPassword;

    const user = await this.userService.create(userDetails);

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const { accessToken, refreshToken } = await this.getTokens(payload);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async login(userDetails: LoginUserDto) {
    const { email, password } = userDetails;

    const user = await this.userService.findOneByEmail(email);

    if (!user || !(await this.compareData(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { id: user.id, email: user.email, username: user.username };
    const { accessToken, refreshToken } = await this.getTokens(payload);

    await this.updateRefreshToken(user.id, refreshToken);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async logout(id: number) {
    await this.userService.update(id, { refreshToken: null });
    return { message: 'Logged out' };
  }

  async getTokens(payload: IJwtPayload) {
    const ACCESS_SECRET = this.configService.get('JWT_ACCESS_SECRET');
    const REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET');

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: ACCESS_SECRET,
        expiresIn: '1d',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: REFRESH_SECRET,
        expiresIn: '30d',
      }),
    };
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const hashRefreshToken = await this.hashData(refreshToken);
    await this.userService.update(id, { refreshToken: hashRefreshToken });
  }

  async refreshAccessToken(refreshToken: string) {
    const REFRESH_SECRET = this.configService.get('JWT_REFRESH_SECRET');

    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: REFRESH_SECRET,
      });

      if (!payload) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const user = await this.userService.findOneById(payload.id);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!user.refreshToken) {
        throw new UnauthorizedException('User is not logged in');
      }

      const compareRefreshToken = await this.compareData(
        refreshToken,
        user.refreshToken,
      );

      if (!compareRefreshToken) {
        throw new UnauthorizedException('Invalid compared refresh token');
      }

      const { accessToken } = await this.getTokens({
        id: user.id,
        email: user.email,
        username: user.username,
      });

      return { accessToken: accessToken };
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async hashData(data: string): Promise<string> {
    return await argon2.hash(data);
  }

  async compareData(data: string, hashedData: string): Promise<boolean> {
    return await argon2.verify(hashedData, data);
  }
}
