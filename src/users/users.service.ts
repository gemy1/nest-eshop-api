import { BadRequestException, Injectable } from '@nestjs/common';
import { Like, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as argon2 from 'argon2';
import { Cart } from '../cart/entities/cart.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(userDetails: CreateUserDto) {
    const user = this.repo.create(userDetails);
    user.cart = new Cart();

    return await this.repo.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email: email } });

    return user;
  }

  async findOneById(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.repo.findOne({ where: { id: id } });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return user;
  }

  async findAll(
    skip: number,
    take: number,
    orderBy: string = 'id',
    sortOrder: string = 'asc',
    search: string = '',
  ) {
    const searchFields = ['username', 'email', 'role'];

    const whereClause = search
      ? searchFields.map((field) => ({ [field]: Like(`%${search}%`) }))
      : {};

    const [data, totalRecord] = await this.repo.findAndCount({
      skip: skip,
      take: take,
      order: { [orderBy]: sortOrder },
      where: search ? whereClause : {},
    });

    return { data, totalRecord };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id: id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const { password } = updateUserDto;
    if (password) {
      const hashPassword = await argon2.hash(password);
      updateUserDto.password = hashPassword;
    }

    Object.assign(user, updateUserDto);

    return await this.repo.save(user);
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    const user = await this.repo.findOne({ where: { id: id } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    Object.assign(user, { refreshToken });

    return await this.repo.save(user);
  }

  async removeById(id: number) {
    const user = await this.findOneById(id);

    const removedUser = await this.repo.remove(user);

    if (!removedUser) {
      throw new BadRequestException('User not found');
    }

    return { message: 'user deleted' };
  }
}
