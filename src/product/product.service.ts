import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entity/user.entity';
import { CategoryService } from 'src/category/category.service';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto, user: User) {
    const { categoryId } = createProductDto;

    let category: Category;
    if (categoryId) {
      category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new BadRequestException('CategoryId not found');
      }
    }

    const product = this.repo.create(createProductDto);

    product.user = user;
    product.category = category;

    return this.repo.save(product);
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOneById(id: number) {
    return await this.repo.findOne({
      where: { id },
    });
  }

  async findOneByName(namePattern: string) {
    return await this.repo.find({
      where: { name: Like(`%${namePattern}%`) },
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.findOneById(id);

    if (!product) {
      throw new BadRequestException('No item match your criteria in products');
    }

    const { categoryId } = updateProductDto;

    let category: Category;
    if (categoryId) {
      category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new BadRequestException('CategoryId not found');
      }
    }

    Object.assign(product, updateProductDto);
    product.category = category;

    const updateProduct = await this.repo.save(product);

    return updateProduct;
  }

  async remove(id: number) {
    const product = await this.findOneById(id);

    if (!product) {
      throw new BadRequestException('No item match your criteria in products');
    }
    const del = await this.repo.delete(id);
    if (del.affected > 0)
      return { ...product, message: 'item deleted successful' };
  }
}
