import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { CategoryModule } from 'src/category/category.module';
import { MulterModule } from '@nestjs/platform-express';
import { ImageModule } from 'src/image/image.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    MulterModule.register(),
    CategoryModule,
    ImageModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
