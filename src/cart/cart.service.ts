import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { addItemDto } from './dto/add-item.dto';
import { User } from '../users/entities/user.entity';
import { ProductService } from '../product/product.service';
import { CartItem } from '../cart-item/entities/cart-item.entity';
import { CartItemService } from '../cart-item/cart-item.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private repo: Repository<Cart>,
    private productService: ProductService,
    private cartItemService: CartItemService,
  ) {}

  async addItem(itemDetails: addItemDto, user: User) {
    const { productId, quantity } = itemDetails;

    const cart = await this.findCartByUserId(user.id);

    const existsItem = cart.cartItems.find((item) => {
      return item.product.id === productId;
    });

    if (existsItem) {
      existsItem.quantity += quantity;
      if (existsItem.quantity > existsItem.product.stockQuantity) {
        throw new BadRequestException('Not enough stock');
      }
      return await this.repo.save(cart);
    }

    const product = await this.productService.findOneWithoutRelation(productId);
    if (!product) {
      throw new BadRequestException('product not found');
    }
    if (product.stockQuantity < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    const newItem = new CartItem();
    newItem.quantity = quantity;
    newItem.product = product;

    cart.cartItems.push(newItem);
    return await this.repo.save(cart);
  }

  async findCartByUserId(id: number) {
    return await this.repo
      .createQueryBuilder('cart')
      .leftJoinAndSelect('cart.cartItems', 'cartItem')
      .leftJoinAndSelect('cartItem.product', 'product')
      .leftJoin('cart.user', 'user')
      .addSelect(['user.id', 'user.username'])
      .where('cart.userId = :id', { id })
      .getOne();
  }

  async update(itemDetails: addItemDto, user: User) {
    const { productId, quantity } = itemDetails;

    const cart = await this.findCartByUserId(user.id);

    const existsItem = cart.cartItems.find((item) => {
      return item.product.id === productId;
    });

    if (!existsItem) {
      throw new BadRequestException('this item is not in the cart');
    }

    existsItem.quantity = quantity;

    if (existsItem.quantity > existsItem.product.stockQuantity) {
      throw new BadRequestException('Not enough stock');
    }

    return await this.repo.save(cart);
  }

  async reset(user: User) {
    const cart = await this.findCartByUserId(user.id);

    if (cart.cartItems.length === 0) {
      throw new BadRequestException('this cart is empty');
    }

    const result = await this.cartItemService.removeAllByCartId(cart.id);
    return { ...result, message: 'The cart item(s) has been removed' };
  }

  async remove(productId: number, user: User) {
    const cart = await this.findCartByUserId(user.id);

    const existsItem = cart.cartItems.find((item) => {
      return item.product.id === productId;
    });

    if (!existsItem) {
      throw new BadRequestException('this item is not in the cart');
    }

    return await this.cartItemService.removeById(existsItem.id);
  }
}
