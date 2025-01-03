import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Like, Repository } from 'typeorm';
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

  async findAll(
    skip: number,
    take: number,
    orderBy: string = 'id',
    sortOrder: string = 'asc',
    search: string = '',
  ) {
    const [data, totalRecord] = await this.repo.findAndCount({
      skip: skip,
      take: take,
      order: { [orderBy]: sortOrder },
      where: search ? { name: Like(`%${search}%`) } : {},
    });

    return { data, totalRecord };
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid category ID');
    }
    const category = await this.repo.findOne({ where: { id } });

    if (!category) {
      throw new BadRequestException('Category not found');
    }

    return category;
  }

  async findOneWithProducts(id: number) {
    return await this.repo.findOne({ where: { id }, relations: ['products'] });
  }

  async findOneByName(name: string) {
    return await this.repo.findOne({ where: { name } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const findCategory = await this.findOneByName(updateCategoryDto.name);
      if (findCategory && findCategory.id !== id) {
        throw new BadRequestException('Category already exists');
      }
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
