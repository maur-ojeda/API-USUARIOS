import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.addresses)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ length: 20 })
  type: string;

  @Column({ length: 255, nullable: true })
  street: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ name: 'zip_code', length: 20, nullable: true })
  zipCode: string;

  @Column({ name: 'country_code', length: 3, nullable: true })
  countryCode: string;

  @Column({ name: 'is_main', default: true })
  isMain: boolean;
}
