import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_attributes')
export class UserAttribute {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', unique: true })
  userId: string;

  @OneToOne(() => User, (user) => user.userAttribute)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'jsonb', nullable: true })
  preferences: Record<string, any>;

  @Column({ name: 'custom_data', type: 'jsonb', nullable: true })
  customData: Record<string, any>;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
