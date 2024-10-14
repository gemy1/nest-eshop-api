import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entitiy/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async create(userDetails: CreateUserDto) {
    const user = this.repo.create(userDetails);

    return await this.repo.save(user);
  }

  async findOne(email: string) {
    return await this.repo.findOne({ where: { email: email } });
  }
}
