import { Expose, Transform, Type } from 'class-transformer';
import { Image } from '../../image/entities/image.entity';
import { ImageResponseDto } from 'src/image/dto/image-response.dto';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  richDescription: string;

  @Expose()
  price: number;

  @Expose()
  @Transform(({ obj }) => {
    return { id: obj.mainImage?.id, path: obj.mainImage?.path };
  })
  mainImage: string;

  @Expose()
  // @Transform(({ obj }) => {
  //   return { id: obj.imagesGallery?.id, path: obj.imagesGallery?.path };
  // })
  @Type(() => ImageResponseDto)
  imagesGallery: Image[];

  @Expose()
  stockQuantity: number;

  @Expose()
  @Transform(({ obj }) => {
    return { id: obj.category?.id, name: obj.category?.name };
  })
  category: number;

  @Expose()
  @Transform(({ obj }) => {
    return { id: obj.user?.id, name: obj.user?.username };
  })
  user: number;

  @Expose()
  tags: string[];

  @Expose()
  rating: number;

  @Expose()
  isFeatured: boolean;

  @Expose()
  message: string;
}
