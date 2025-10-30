import { ApiProperty } from '@nestjs/swagger';
import { ProductEntity } from 'src/products/entities/product.entity';
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
} from 'typeorm';

@Entity('categories')
export class CategoryEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column()
  description: string;

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
    (user) => user.categories,
  )
  @ApiProperty({ type: () => UserEntity })
  addedBy: UserEntity;

  @OneToMany(
    () => ProductEntity,
    (product) => product.category,
  )
  @ApiProperty({ type: () => ProductEntity, isArray: true })
  products: ProductEntity[];
}
