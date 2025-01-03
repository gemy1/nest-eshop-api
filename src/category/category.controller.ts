import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CategoryProductsResponseDto } from './dto/category-products-response.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @Roles(['admin'])
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @Public()
  findAll(@Query() query: GetCategoriesDto) {
    const { skip, take, orderBy, sortOrder, search } = query;

    return this.categoryService.findAll(skip, take, orderBy, sortOrder, search);
  }

  @Get(':id/products')
  @Public()
  @Serialize(CategoryProductsResponseDto)
  async findCategoryProducts(@Param('id') id: string) {
    if (isNaN(+id)) {
      throw new BadRequestException('Invalid category ID');
    }

    const productsInCategory =
      await this.categoryService.findOneWithProducts(+id);
    return productsInCategory;
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    const category = await this.categoryService.findOne(+id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  @Patch(':id')
  @Roles(['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
