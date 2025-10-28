import { ProductEntity } from 'src/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
  ValueTransformer,
} from 'typeorm';
import { OrderEntity } from './order.entity';

const numericTransformer: ValueTransformer = {
  to: (value: number) => (value === null || value === undefined ? null : value),
  from: (value: string) =>
    value === null || value === undefined ? null : Number(value),
};

@Entity('orders_products')
export class OrdersProductsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  unitPrice: number;

  @Column()
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @ManyToOne(
    () => OrderEntity,
    (order) => order.products,
    { onDelete: 'CASCADE' },
  )
  order: OrderEntity;

  @ManyToOne(
    () => ProductEntity,
    (product) => product.orders,
    { eager: true },
  )
  product: ProductEntity;
}
