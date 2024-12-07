import { Expose, Type } from 'class-transformer';
import { ProductResponseDetailsDto } from '../../product/dto/product-response-details.dto';

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
  @Type(() => ProductResponseDetailsDto)
  products: ProductResponseDetailsDto[];
}
