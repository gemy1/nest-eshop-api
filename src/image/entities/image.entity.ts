import { Product } from '../../product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Product, (product) => product.imagesGallery, {
    cascade: true,
    onDelete: 'SET NULL',
  })
  product: Product;
}
