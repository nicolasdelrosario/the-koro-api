import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { OrdersProductsEntity } from './orders-products.entity';
import { ShippingEntity } from './shipping.entity';
import { Expose } from 'class-transformer';

@Entity('orders')
export class OrderEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderAt: Date;

  @ApiProperty({ enum: OrderStatus })
  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

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
    (user) => user.ordersUpdated,
    {
      onDelete: 'SET NULL',
      nullable: true,
    },
  )
  @JoinColumn()
  @ApiProperty({ type: () => UserEntity, nullable: true })
  updatedBy: UserEntity;

  @OneToOne(
    () => ShippingEntity,
    (shipping) => shipping.order,
    {
      cascade: true,
      eager: true,
    },
  )
  @JoinColumn()
  @ApiProperty({ type: () => ShippingEntity })
  shipping: ShippingEntity;

  @OneToMany(
    () => OrdersProductsEntity,
    (ordersProducts) => ordersProducts.order,
    {
      cascade: true,
      eager: true,
    },
  )
  @ApiProperty({ type: () => OrdersProductsEntity, isArray: true })
  products: OrdersProductsEntity[];

  @ManyToOne(
    () => UserEntity,
    (user) => user.ordersCreated,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn()
  @ApiProperty({ type: () => UserEntity })
  orderBy: UserEntity;

  @ApiProperty({ type: Number })
  @Expose()
  get total(): number {
    if (!this.products || this.products.length === 0) return 0;
    return this.products.reduce(
      (sum, op) => sum + Number(op.unitPrice) * op.quantity,
      0,
    );
  }
}
