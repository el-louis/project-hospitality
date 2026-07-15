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

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CHECKED_OUT = 'checked_out',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

const moneyTransformer = {
  from: (value: string): number => Number(value),
  to: (value: number): number => value,
};

@Entity({ name: 'bookings' })
@Check('CK_bookings_date_range', '"check_out" > "check_in"')
@Check('CK_bookings_guest_count', '"guest_count" > 0')
@Check(
  'CK_bookings_amounts',
  '"nightly_rate_snapshot" >= 0 AND "total_amount" >= 0',
)
@Check(
  'CK_bookings_currency',
  'char_length("currency") = 3 AND "currency" = upper("currency")',
)
@Index('IDX_bookings_apartment_dates_status', [
  'apartmentId',
  'status',
  'checkIn',
  'checkOut',
])
@Index('IDX_bookings_user_created_at', ['userId', 'createdAt'])
@Index('IDX_bookings_status', ['status'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 32 })
  reference: string;

  @Column({ name: 'apartment_id', type: 'uuid' })
  apartmentId: string;

  @ManyToOne(() => Apartment, (apartment) => apartment.bookings, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'apartment_id' })
  apartment: Apartment;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId?: string | null;

  @ManyToOne(() => User, (user) => user.bookings, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User | null;

  @Column({ name: 'guest_first_name', length: 100 })
  guestFirstName: string;

  @Column({ name: 'guest_last_name', length: 100 })
  guestLastName: string;

  @Column({ name: 'guest_email', length: 320 })
  guestEmail: string;

  @Column({ name: 'guest_phone', length: 30 })
  guestPhone: string;

  @Column({ name: 'check_in', type: 'date' })
  checkIn: string;

  @Column({ name: 'check_out', type: 'date' })
  checkOut: string;

  @Column({ name: 'guest_count', type: 'int' })
  guestCount: number;

  @Column({
    name: 'nightly_rate_snapshot',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: moneyTransformer,
  })
  nightlyRateSnapshot: number;

  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 12,
    scale: 2,
    transformer: moneyTransformer,
  })
  totalAmount: number;

  @Column({ length: 3, default: 'USD' })
  currency: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @Column({ name: 'guest_notes', type: 'text', nullable: true })
  guestNotes?: string | null;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes?: string | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
