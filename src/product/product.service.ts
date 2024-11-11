import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Like, Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { CategoryService } from '../category/category.service';
import { Category } from '../category/entities/category.entity';
import { ImageService } from '../image/image.service';
import { Image } from '../image/entities/image.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private categoryService: CategoryService,
    private imageService: ImageService,
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
    if (isNaN(id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.repo.findOne({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException('No item match your criteria in products');
    }

    return product;
  }

  async findOneByName(namePattern: string) {
    return await this.repo.find({
      where: { name: Like(`%${namePattern}%`) },
    });
  }

  async findOneWithoutRelation(id: number) {
    return await this.repo
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOneById(id);

    Object.assign(product, updateProductDto);

    const { categoryId } = updateProductDto;

    if (categoryId) {
      const category = await this.categoryService.findOne(categoryId);
      if (!category) {
        throw new BadRequestException('CategoryId not found');
      }
      product.category = category;
    }

    return await this.repo.save(product);
  }

  async remove(id: number) {
    const product = await this.findOneById(id);

    const deletedProduct = await this.repo.remove(product);

    try {
      await this.imageService.remove(product.mainImage?.id);
    } catch {}

    return { ...deletedProduct, message: 'item deleted successful' };
  }

  async updateProductMainImage(productId: number, image: Express.Multer.File) {
    const product = await this.findOneById(productId);

    const imageId = product.mainImage?.id;
    if (imageId) {
      await this.imageService.remove(+imageId);
    }

    const newImage = new Image();
    newImage.path = image.path;

    product.mainImage = newImage;

    const updatedProduct = await this.repo.save(product);

    return { ...updatedProduct, message: 'Main image updated successful' };
  }

  async updateProductImageGallery(id: number, images: Express.Multer.File[]) {
    const product = await this.findOneById(id);

    const imagePathArray = images.map((img) => img.path);

    try {
      await Promise.all(
        imagePathArray.map((imagePath) =>
          this.imageService.uploadImage(imagePath, product),
        ),
      );
    } catch {
      throw new ServiceUnavailableException('Could not upload image');
    }

    return { message: 'Image added to gallery successful' };
  }

  async deleteMainImage(id: number) {
    const product = await this.findOneById(id);

    const mainImage = product.mainImage;

    if (!mainImage) {
      throw new BadRequestException('No main image found');
    }
    product.mainImage = null;

    await this.repo.save(product);
    await this.imageService.remove(mainImage.id);

    return { message: 'Main image deleted successful' };
  }

  async deleteProductGalleryImage(productId: number, imageId: number) {
    if (isNaN(imageId)) {
      throw new BadRequestException('Invalid image ID');
    }

    const product = await this.findOneById(productId);

    if (!product) {
      throw new BadRequestException(
        'No product match your criteria in products',
      );
    }

    const imageExists = product.imagesGallery.some(
      (image) => image.id === imageId,
    );

    if (!imageExists) {
      throw new BadRequestException(
        'Image does not belong to the specified product',
      );
    }

    await this.imageService.remove(imageId);

    return { message: 'Image deleted successfully' };
  }
}
