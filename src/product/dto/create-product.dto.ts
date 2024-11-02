// create-product.dto.ts
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsPositive,
  IsInt,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsOptional()
  image: string;

  @IsArray()
  @IsString({ each: true }) // Validates each item in the array is a string
  @IsOptional()
  images: string[];

  @IsNumber()
  @IsPositive()
  @IsInt()
  stockQuantity: number;

  @IsNumber()
  @IsOptional()
  categoryId: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsBoolean()
  @IsOptional()
  isFeatured: boolean;
}
