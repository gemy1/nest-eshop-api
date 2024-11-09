// create-product.dto.ts
import { Transform } from 'class-transformer';
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

  @IsString()
  richDescription: string;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  price: number;

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  @IsPositive()
  @IsInt()
  stockQuantity: number;

  @Transform(({ value }) => parseFloat(value))
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
