import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { ProductModule } from '../product/product.module';
import { CartItemModule } from '../cart-item/cart-item.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), ProductModule, CartItemModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
