import { User } from 'src/users/entity/user.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0 })
  price: number;

  @Column({ default: '' })
  image: string;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @Column({ default: 0 })
  stockQuantity: number;

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { eager: true })
  user: User;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[]; // Optional tags for filtering or categorization

  @Column({ nullable: true })
  rating: number;

  @Column({ default: false })
  isFeatured: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
