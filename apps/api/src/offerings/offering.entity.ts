import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ContentConfidence } from '../red-masai/content-confidence';

export enum OfferingCategory {
  STAY = 'STAY',
  CELEBRATE = 'CELEBRATE',
  EXPERIENCE = 'EXPERIENCE',
  CREATE = 'CREATE',
}

export enum OfferingBookingMethod {
  DIRECT_BOOKING = 'DIRECT_BOOKING',
  ENQUIRY = 'ENQUIRY',
  WHATSAPP = 'WHATSAPP',
}

const nullableMoneyTransformer = {
  from: (value: string | null): number | null =>
    value === null ? null : Number(value),
  to: (value?: number | null): number | null => value ?? null,
};

@Entity({ name: 'offerings' })
@Check(
  'CK_offerings_starting_price',
  '"starting_price" IS NULL OR "starting_price" >= 0',
)
@Check('CK_offerings_capacity', '"capacity" IS NULL OR "capacity" > 0')
@Check(
  'CK_offerings_currency',
  'char_length("currency") = 3 AND "currency" = upper("currency")',
)
@Index('IDX_offerings_public_order', ['active', 'category', 'displayOrder'])
export class Offering {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: OfferingCategory })
  category: OfferingCategory;

  @Column({ unique: true, length: 100 })
  slug: string;

  @Column({ length: 160 })
  title: string;

  @Column({ name: 'short_summary', type: 'text' })
  shortSummary: string;

  @Column({ name: 'full_description', type: 'text' })
  fullDescription: string;

  @Column({
    name: 'starting_price',
    type: 'numeric',
    precision: 12,
    scale: 2,
    nullable: true,
    transformer: nullableMoneyTransformer,
  })
  startingPrice?: number | null;

  @Column({ length: 3, default: 'TZS' })
  currency: string;

  @Column({ name: 'pricing_note', type: 'text', nullable: true })
  pricingNote?: string | null;

  @Column({ type: 'int', nullable: true })
  capacity?: number | null;

  @Column({ name: 'duration_note', type: 'text', nullable: true })
  durationNote?: string | null;

  @Column({
    name: 'included_items',
    type: 'jsonb',
    default: () => "'[]'::jsonb",
  })
  includedItems: string[];

  @Column({ name: 'additional_charge_note', type: 'text', nullable: true })
  additionalChargeNote?: string | null;

  @Column({ name: 'booking_method', type: 'enum', enum: OfferingBookingMethod })
  bookingMethod: OfferingBookingMethod;

  @Column({ name: 'whatsapp_action', default: false })
  whatsappAction: boolean;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl?: string | null;

  @Column({ default: true })
  active: boolean;

  @Column({ default: false })
  featured: boolean;

  @Column({ name: 'display_order', type: 'int', default: 0 })
  displayOrder: number;

  @Column({ name: 'content_confidence', type: 'enum', enum: ContentConfidence })
  contentConfidence: ContentConfidence;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
