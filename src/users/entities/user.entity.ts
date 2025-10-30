import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { OrderEntity } from 'src/orders/entities/order.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';
import { Role } from 'src/utility/common/enums/roles.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class UserEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ writeOnly: true })
  @Column({ select: false })
  password: string;

  @ApiProperty({ enum: Role, isArray: true })
  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @ApiProperty({ type: String, format: 'date-time' })
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @ApiProperty({ type: String, format: 'date-time' })
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @ApiProperty({ type: String, format: 'date-time' })
  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @OneToMany(
    () => CategoryEntity,
    (category) => category.addedBy,
  )
  @ApiProperty({ type: () => CategoryEntity, isArray: true })
  categories: CategoryEntity[];

  @OneToMany(
    () => ProductEntity,
    (product) => product.addedBy,
  )
  @ApiProperty({ type: () => ProductEntity, isArray: true })
  products: ProductEntity[];

  @OneToMany(
    () => ReviewEntity,
    (review) => review.user,
  )
  @ApiProperty({ type: () => ReviewEntity, isArray: true })
  reviews: ReviewEntity[];

  @OneToMany(
    () => OrderEntity,
    (order) => order.updatedBy,
  )
  @ApiProperty({ type: () => OrderEntity, isArray: true })
  ordersUpdated: OrderEntity[];

  @OneToMany(
    () => OrderEntity,
    (order) => order.orderBy,
  )
  @ApiProperty({ type: () => OrderEntity, isArray: true })
  ordersCreated: OrderEntity[];
}
