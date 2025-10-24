import { Role } from 'src/utility/common/enums/roles.enum';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
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
}
