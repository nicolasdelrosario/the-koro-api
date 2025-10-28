import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

@Entity('shipping')
export class ShippingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  phone: string;

  @Column({ default: '' })
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postCode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @OneToOne(
    () => OrderEntity,
    (order) => order.shipping,
  )
  order: OrderEntity;
}
