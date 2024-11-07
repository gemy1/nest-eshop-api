import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  BadRequestException,
  Query,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';
import { Serialize } from '../interceptors/serialize.interceptor';
import { ProductResponseDto } from './dto/product-response.dto';
import { ProtectFields } from '../decorators/protect-fields.decorator';
import { Public } from '../decorators/public.decorator';
import { ProductSearchDto } from './dto/product-search.dto';
import { OwnershipCheck } from '../decorators/ownership.decorator';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

@Controller('product')
@Serialize(ProductResponseDto)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  //upload product main image
  @Post(':id/image')
  @OwnershipCheck()
  @UseInterceptors(FileInterceptor('image', multerConfig))
  async UploadProductMainImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('No image provided');
    }

    return this.productService.updateProductMainImage(+id, image);
  }

  // upload product images gallery
  @Post(':id/images')
  @OwnershipCheck()
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async UploadProductImagesGallery(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ) {
    if (!images) {
      throw new BadRequestException('No images provided');
    }

    return await this.productService.updateProductImageGallery(+id, images);
  }

  // delete main image
  @Delete(':id/image')
  @OwnershipCheck()
  async DeleteProductMainImage(@Param('id') productId: string) {
    return this.productService.deleteMainImage(+productId);
  }

  // delete image gallery
  @Delete(':id/images/:imageId')
  @OwnershipCheck()
  async DeleteProductImageGallery(
    @Param('id') productId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.productService.deleteProductGalleryImage(+productId, +imageId);
  }

  @Post()
  @ProtectFields(['isFeatured', 'rating'])
  create(@Body() createProductDto: CreateProductDto, @Req() req: Request) {
    return this.productService.create(createProductDto, req.currentUser);
  }

  @Get()
  @Public()
  findAll() {
    return this.productService.findAll();
  }

  @Get('/search')
  @Public()
  findOneByName(@Query() query: ProductSearchDto) {
    return this.productService.findOneByName(query.name);
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.productService.findOneById(+id);
  }

  @Patch(':id')
  @OwnershipCheck()
  @ProtectFields(['isFeatured', 'rating'])
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @OwnershipCheck()
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
