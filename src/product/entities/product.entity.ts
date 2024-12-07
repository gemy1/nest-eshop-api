import { User } from '../../users/entities/user.entity';
import { Category } from '../../category/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Image } from '../../image/entities/image.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', default: '' })
  richDescription: string;

  @Column({ default: 0 })
  price: number;

  @OneToOne(() => Image, { eager: true, cascade: true, onDelete: 'SET NULL' })
  @JoinColumn()
  mainImage: Image;

  @OneToMany(() => Image, (image) => image.product, {
    eager: true,
  })
  imagesGallery: Image[];

  @Column({ default: 0 })
  stockQuantity: number;

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, {
    eager: true,
    cascade: true,
    onDelete: 'SET NULL',
  })
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
