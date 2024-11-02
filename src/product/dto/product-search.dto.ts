import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class ProductSearchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @Transform(({ value }) => (value ? +value : ''))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;
}
