import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  async registerUser(@Body() userDetails: CreateUserDto) {
    return await this.authService.register(userDetails);
  }
  @Public()
  @Post('login')
  async loginUser(@Body() userDetails: LoginUserDto) {
    return this.authService.login(userDetails);
  }
  @Get('logout')
  async logout(@Req() req: Request) {
    return await this.authService.logout(parseInt(req['user'].id));
  }

  @Public()
  @Get('refresh')
  getRefreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshAccessToken(refreshToken);
  }
}
