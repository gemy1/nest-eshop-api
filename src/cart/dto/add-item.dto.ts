import { IsNumber } from 'class-validator';

export class addItemDto {
  @IsNumber()
  productId: number;

  @IsNumber()
  quantity: number;
}
