import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(userDetails: CreateUserDto) {
    const user = this.repo.create(userDetails);

    return await this.repo.save(user);
  }

  async findOneByEmail(email: string) {
    const user = await this.repo.findOne({ where: { email: email } });

    return user;
  }

  async findOneById(id: number) {
    const user = await this.repo.findOne({ where: { id: id } });

    return user;
  }

  async findAll() {
    return await this.repo.find();
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.repo.findOne({ where: { id: id } });

    if (!user) {
      throw new BadRequestException('User not found');
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
    const user = await this.repo.delete(id);

    if (user.affected === 0) {
      throw new BadRequestException('User not found');
    }

    return { message: 'user deleted' };
  }
}
