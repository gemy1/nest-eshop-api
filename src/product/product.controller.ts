import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  NotFoundException,
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
  @UseInterceptors(FileInterceptor('image', multerConfig))
  productImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    return this.productService.update(parseInt(id), { image: file.path });
  }

  // upload product images gallery
  @Post(':id/images')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  productImagesGallery(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files) {
      throw new BadRequestException('No images provided');
    }

    const imagePathArray = files.map((file) => file.path);

    return this.productService.update(parseInt(id), { images: imagePathArray });
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
    if (isNaN(+id)) {
      throw new BadRequestException('Invalid product ID');
    }

    const product = await this.productService.findOneById(+id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
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
