import {
  Column,
  Check,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Apartment } from '../apartments/apartment.entity';
import { User } from '../users/user.entity';

@Entity({ name: 'availability_blocks' })
@Check('CK_availability_blocks_date_range', '"end_date" > "start_date"')
@Index('IDX_availability_blocks_apartment_dates', [
  'apartmentId',
  'startDate',
  'endDate',
])
@Index('IDX_availability_blocks_created_by', ['createdByUserId'])
export class AvailabilityBlock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'apartment_id', type: 'uuid' })
  apartmentId: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.availabilityBlocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @Column({ name: 'start_date', type: 'date' })
  startDate: string;

  @Column({ name: 'end_date', type: 'date' })
  endDate: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  reason?: string | null;

  @Column({ name: 'created_by_user_id', type: 'uuid', nullable: true })
  createdByUserId?: string | null;

  @ManyToOne(() => User, (user) => user.availabilityBlocks, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'created_by_user_id' })
  createdByUser?: User | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
