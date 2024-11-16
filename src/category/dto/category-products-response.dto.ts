import { Expose, Type } from 'class-transformer';
import { ProductResponseDto } from '../../product/dto/product-response.dto';

export class CategoryProductsResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  color: string;

  @Expose()
  @Type(() => ProductResponseDto)
  products: ProductResponseDto[];
}
