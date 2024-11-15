import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../payment/entities/payment.entity';
import { CartService } from '../cart/cart.service';
import { User } from '../users/entities/user.entity';
import { OrderItem } from '../order-item/entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private repo: Repository<Order>,
    private cartService: CartService,
  ) {}
  async create(createOrderDto: CreateOrderDto, user: User) {
    const { paymentMethod } = createOrderDto;

    const cart = await this.cartService.findCartByUserId(user.id);

    if (cart.cartItems.length > 0) {
      throw new BadRequestException('cart is empty');
    }

    const payment = new Payment();
    payment.method = paymentMethod;

    const order = this.repo.create();

    let totalPrice = 0;

    const orderItems = cart.cartItems.map((item) => {
      const orderItem = new OrderItem();
      orderItem.product = item.product;
      orderItem.quantity = item.quantity;
      orderItem.price = item.product.price * item.quantity;
      totalPrice += orderItem.price;
      return orderItem;
    });

    payment.amount = totalPrice;

    order.totalPrice = totalPrice;
    order.payments = [payment];
    order.user = user;
    order.orderItems = orderItems;

    const newOrder = await this.repo.save(order);
    if (!newOrder) {
      throw new ServiceUnavailableException();
    }
    await this.cartService.reset(user);
    return newOrder;
  }

  async findAll() {
    return await this.repo.find();
  }

  async findOne(id: number) {
    if (isNaN(id)) {
      throw new BadRequestException('Invalid order ID');
    }
    const order = await this.repo.findOne({
      where: { id },
      relations: ['orderItems', 'payments'],
    });
    if (!order) {
      throw new BadRequestException('Order not found');
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    Object.assign(order, updateOrderDto);

    return await this.repo.save(order);
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
