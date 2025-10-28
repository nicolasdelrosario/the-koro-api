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

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: OrderStatus;

  @Column({ type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

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
  shipping: ShippingEntity;

  @OneToMany(
    () => OrdersProductsEntity,
    (ordersProducts) => ordersProducts.order,
    {
      cascade: true,
      eager: true,
    },
  )
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
  orderBy: UserEntity;

  get total(): number {
    if (!this.products || this.products.length === 0) return 0;
    return this.products.reduce(
      (sum, op) => sum + Number(op.unitPrice) * op.quantity,
      0,
    );
  }
}
