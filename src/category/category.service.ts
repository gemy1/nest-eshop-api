import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private repo: Repository<Category>) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name } = createCategoryDto;

    const findCategory = await this.findOneByName(name);

    if (findCategory) {
      throw new BadRequestException('Category already exists');
    }

    const category = this.repo.create(createCategoryDto);

    return await this.repo.save(category);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async findOneWithProducts(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['products'] });
  }

  async findOneByName(name: string) {
    return await this.repo.findOne({ where: { name } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    Object.assign(category, updateCategoryDto);

    return await this.repo.save(category);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    if (!category) {
      throw new BadRequestException(
        'No item match your criteria in categories',
      );
    }
    const del = await this.repo.delete(id);
    if (del.affected > 0)
      return { category: category, message: 'item deleted successful' };
  }
}
