import { IsOptional, IsIn, IsInt, IsPositive, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCategoriesDto {
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
  @IsIn(['id', 'name', 'description', 'color'])
  orderBy?: 'id' | 'name' | 'description' | 'color';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  search?: string;
}
