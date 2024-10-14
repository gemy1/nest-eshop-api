import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { LoginUserDto } from './dtos/login-user.dto';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async register(userDetails: CreateUserDto) {
    const { password } = userDetails;

    const hashedPassword = await bcrypt.hash(password, 10);

    userDetails.password = hashedPassword;

    return await this.userService.create(userDetails);
  }

  async login(userDetails: LoginUserDto) {
    const { email, password } = userDetails;

    const user = await this.userService.findOne(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
