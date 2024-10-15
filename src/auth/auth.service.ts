import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from '../users/dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

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

    const payload = { id: user.id, email: user.email, username: user.username };
    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken: accessToken };
  }
}
