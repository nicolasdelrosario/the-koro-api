import { ProductEntity } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Timestamp,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reviews')
export class ReviewEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ratings: number;

  @Column()
  comment: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @ManyToOne(
    () => UserEntity,
    (user) => user.reviews,
  )
  user: UserEntity;

  @ManyToOne(
    () => ProductEntity,
    (product) => product.reviews,
  )
  product: ProductEntity;
}
