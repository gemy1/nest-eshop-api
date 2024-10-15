import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { AuthService } from './auth.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReturnedUserDto } from 'src/users/dtos/returned-user.dto';

@Controller('auth')
@Serialize(ReturnedUserDto)
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/register')
  async registerUser(@Body() userDetails: CreateUserDto) {
    return await this.authService.register(userDetails);
  }

  @Post('/login')
  async loginUser(@Body() userDetails: LoginUserDto) {
    return this.authService.login(userDetails);
  }
}
