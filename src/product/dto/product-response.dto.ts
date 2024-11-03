import { Expose, Transform } from 'class-transformer';

export class ProductResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  image: string;

  @Expose()
  images: string[];

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

  @Expose()
  file: any;

  @Expose()
  files: any;
}
