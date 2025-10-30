import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ minimum: 1, maximum: 5 })
  @Column()
  ratings: number;

  @ApiProperty()
  @Column()
  comment: string;

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
    (user) => user.reviews,
  )
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;

  @ManyToOne(
    () => ProductEntity,
    (product) => product.reviews,
  )
  @ApiProperty({ type: () => ProductEntity })
  product: ProductEntity;
}
