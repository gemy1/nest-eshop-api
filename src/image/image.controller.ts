import {
  Controller,
  Post,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { multerConfig } from '../config/multer.config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../decorators/roles.decorator';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('upload', multerConfig))
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No image provided');
    }

    const image = await this.imageService.uploadImage(file.path);
    return { url: `http://localhost:3000/${image.path}` };
  }

  @Delete(':id')
  @Roles(['admin'])
  remove(@Param('id') id: string) {
    return this.imageService.remove(+id);
  }
}
