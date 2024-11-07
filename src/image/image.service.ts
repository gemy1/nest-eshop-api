import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';
import { unlinkSync } from 'fs';
import * as path from 'path';

@Injectable()
export class ImageService {
  constructor(@InjectRepository(Image) private repo: Repository<Image>) {}
  async uploadImage(imagePath: string, product?: Product) {
    const image = this.repo.create();

    image.path = imagePath;
    if (product) {
      image.product = product;
    }

    return await this.repo.save(image);
  }

  async findOne(id: number) {
    return await this.repo.findOne({ where: { id } });
  }

  async remove(id: number) {
    const image = await this.findOne(id);

    if (!image) {
      throw new NotFoundException(`Image with id ${id} not found`);
    }

    await this.repo.delete(image.id);

    try {
      unlinkSync(path.resolve(image.path));
    } catch {}
  }
}
