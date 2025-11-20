import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: numericTransformer,
  })
  @ApiProperty({ type: Number, example: 99.99 })
  price: number;

  @ApiProperty({ type: Number })
  @Column({ default: 0 })
  stock: number;

  @ApiProperty({ type: [String] })
  @Column('simple-array')
  images: string[];

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @ApiProperty({ type: String, format: 'date-time' })
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
  @ApiProperty({ type: () => UserEntity, nullable: true })
  addedBy: UserEntity;

  @ManyToOne(
    () => CategoryEntity,
    (category) => category.products,
    {
      onDelete: 'SET NULL',
      eager: false,
    },
  )
  @ApiProperty({ type: () => CategoryEntity, nullable: true })
  category: CategoryEntity;

  @OneToMany(
    () => ReviewEntity,
    (review) => review.product,
  )
  @ApiProperty({ type: () => ReviewEntity, isArray: true })
  reviews: ReviewEntity[];

  @OneToMany(
    () => OrdersProductsEntity,
    (ordersProducts) => ordersProducts.product,
  )
  @ApiProperty({ type: () => OrdersProductsEntity, isArray: true })
  orders: OrdersProductsEntity[];
}
