import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  path: string;

  @ManyToOne(() => Product, (product) => product.imagesGallery, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  product: Product;
}
