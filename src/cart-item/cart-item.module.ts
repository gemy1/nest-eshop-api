import { Module } from '@nestjs/common';
import { CartItemService } from './cart-item.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entities/cart-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem])],
  providers: [CartItemService],
  exports: [CartItemService],
})
export class CartItemModule {}
