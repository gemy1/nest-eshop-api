import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReturnedUserDto } from './dtos/returned-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

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
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(parseInt(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(parseInt(id), updateUser);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id));
  }
}
