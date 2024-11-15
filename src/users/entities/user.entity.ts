import { Order } from 'src/order/entities/order.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Product } from '../../product/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: null })
  refreshToken: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => Product, (product) => product.user)
  products: Product[];

  @OneToOne(() => Cart, (cart) => cart.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  cart: Cart;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
