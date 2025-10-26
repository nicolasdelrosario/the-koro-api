import { CategoryEntity } from 'src/categories/entities/category.entity';
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
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ type: 'enum', enum: Role, array: true, default: [Role.USER] })
  roles: Role[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Timestamp;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Timestamp;

  @DeleteDateColumn({ type: 'timestamp' })
  deletedAt: Timestamp;

  @OneToMany(
    () => CategoryEntity,
    (category) => category.addedBy,
  )
  categories: CategoryEntity[];

  @OneToMany(
    () => ProductEntity,
    (product) => product.addedBy,
  )
  products: ProductEntity[];

  @OneToMany(
    () => ReviewEntity,
    (review) => review.user,
  )
  reviews: ReviewEntity[];
}
