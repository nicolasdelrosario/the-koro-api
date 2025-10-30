import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: numericTransformer,
  })
  @ApiProperty({ type: Number, example: 9.99 })
  unitPrice: number;

  @ApiProperty({ type: Number })
  @Column()
  quantity: number;

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
    () => OrderEntity,
    (order) => order.products,
    { onDelete: 'CASCADE' },
  )
  @ApiProperty({ type: () => OrderEntity })
  order: OrderEntity;

  @ManyToOne(
    () => ProductEntity,
    (product) => product.orders,
    { eager: true },
  )
  @ApiProperty({ type: () => ProductEntity })
  product: ProductEntity;
}
