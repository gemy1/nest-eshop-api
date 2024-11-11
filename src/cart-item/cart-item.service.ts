import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CartItem } from './entities/cart-item.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CartItemService {
  constructor(@InjectRepository(CartItem) private repo: Repository<CartItem>) {}

  async removeById(id: number) {
    const del = await this.repo.delete(id);
    if (del.affected === 0) {
      throw new BadRequestException('item not found');
    }
    return { message: 'item deleted' };
  }

  async removeAllByCartId(cartId: number) {
    return await this.repo
      .createQueryBuilder('cartItem')
      .delete()
      .where('cartId = :cartId', { cartId })
      .execute();
  }
}
