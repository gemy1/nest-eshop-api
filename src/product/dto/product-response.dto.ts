import { Expose, Type } from 'class-transformer';
import { ProductResponseDetailsDto } from './product-response-details.dto';

export class ProductResponseDto {
  @Expose()
  @Type(() => ProductResponseDetailsDto)
  data: ProductResponseDetailsDto[];

  @Expose()
  totalRecord: number;
}
