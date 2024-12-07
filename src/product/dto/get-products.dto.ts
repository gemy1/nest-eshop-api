import { IsOptional, IsIn, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetProductsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  skip?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  take?: number;

  @IsOptional()
  @IsIn(['id', 'name', 'price', 'rating'])
  orderBy?: 'id' | 'name' | 'price' | 'rating';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}
