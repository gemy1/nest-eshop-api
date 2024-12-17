import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ReturnedUserDto } from './dtos/returned-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from '../decorators/roles.decorator';
import { OwnershipCheck } from '../decorators/ownership.decorator';
import { ProtectFields } from '../decorators/protect-fields.decorator';
import { GetUsers } from './dtos/get-users.dto';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  //TODO: Implement createUser method

  @Get()
  @Roles(['admin'])
  @Serialize(UserResponseDto)
  findAll(@Query() query: GetUsers) {
    const { skip, take, orderBy, sortOrder, search } = query;
    return this.userService.findAll(skip, take, orderBy, sortOrder, search);
  }

  @Get(':id')
  @OwnershipCheck()
  @Serialize(ReturnedUserDto)
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOneById(parseInt(id));
    if (!user) {
      throw new BadRequestException('User not found');
    }
    return user;
  }

  @Patch(':id')
  @OwnershipCheck()
  @ProtectFields(['role'])
  @Serialize(ReturnedUserDto)
  update(@Param('id') id: string, @Body() updateUser: UpdateUserDto) {
    return this.userService.update(parseInt(id), updateUser);
  }

  @Delete(':id')
  @OwnershipCheck()
  removeUser(@Param('id') id: string) {
    return this.userService.removeById(parseInt(id));
  }
}
