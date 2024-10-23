import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReturnedUserDto } from './dtos/returned-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('users')
@Serialize(ReturnedUserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  //TODO: Implement createUser method

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(parseInt(id));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Roles(['admin'])
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(parseInt(id), updateUser);
  }

  @Roles(['admin'])
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id));
  }
}
