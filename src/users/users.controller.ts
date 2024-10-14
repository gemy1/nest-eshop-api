import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReturnedUserDto } from './dtos/returned-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(ReturnedUserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private AuthService: AuthService,
  ) {}

  @Post('/register')
  async registerUser(@Body() userDetails: CreateUserDto) {
    return await this.AuthService.register(userDetails);
  }

  @Post('/login')
  async loginUser(@Body() userDetails: LoginUserDto) {
    return this.AuthService.login(userDetails);
  }
}
