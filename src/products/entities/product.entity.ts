import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrdersProductsEntity } from 'src/orders/entities/orders-products.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';

const numericTransformer: ValueTransformer = {
  to: (value: number | null): number | null => (value === null ? null : value),
  from: (value: string | null): number | null =>
    value === null ? null : parseFloat(value),
};

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  price: number;

  @Column({ default: 0 })
  stock: number;

  @Column('simple-array')
  images: string[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @ManyToOne(
    () => UserEntity,
    (user) => user.products,
    {
      onDelete: 'SET NULL',
      eager: false,
    },
  )
  addedBy: UserEntity;

  @ManyToOne(
    () => CategoryEntity,
    (category) => category.products,
    {
      onDelete: 'SET NULL',
      eager: true,
    },
  )
  category: CategoryEntity;

  @OneToMany(
    () => ReviewEntity,
    (review) => review.product,
  )
  reviews: ReviewEntity[];

  @OneToMany(
    () => OrdersProductsEntity,
    (ordersProducts) => ordersProducts.product,
  )
  orders: OrdersProductsEntity[];
}
