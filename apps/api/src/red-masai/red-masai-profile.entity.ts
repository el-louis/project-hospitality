import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { ProfileFieldConfidence } from './content-confidence';

@Entity({ name: 'red_masai_profile' })
export class RedMasaiProfile {
  @PrimaryColumn({ type: 'smallint', default: 1 })
  id: number;

  @Column({ name: 'display_name', length: 160 })
  displayName: string;

  @Column({ length: 200 })
  tagline: string;

  @Column({ name: 'value_proposition', length: 240 })
  valueProposition: string;

  @Column({ name: 'short_description', type: 'text' })
  shortDescription: string;

  @Column({ name: 'full_description', type: 'text' })
  fullDescription: string;

  @Column({ length: 30, nullable: true })
  phone?: string | null;

  @Column({ length: 30, nullable: true })
  whatsapp?: string | null;

  @Column({ length: 320, nullable: true })
  email?: string | null;

  @Column({ type: 'text', nullable: true })
  address?: string | null;

  @Column({ length: 120 })
  city: string;

  @Column({ length: 120 })
  region: string;

  @Column({ length: 120 })
  country: string;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  latitude?: number | null;

  @Column({ type: 'numeric', precision: 10, scale: 7, nullable: true })
  longitude?: number | null;

  @Column({ name: 'logo_url', type: 'text', nullable: true })
  logoUrl?: string | null;

  @Column({ name: 'cover_image_url', type: 'text', nullable: true })
  coverImageUrl?: string | null;

  @Column({ name: 'instagram_url', type: 'text', nullable: true })
  instagramUrl?: string | null;

  @Column({ name: 'social_links', type: 'jsonb', default: () => "'{}'::jsonb" })
  socialLinks: Record<string, string>;

  @Column({ length: 80 })
  timezone: string;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime?: string | null;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime?: string | null;

  @Column({ name: 'default_currency', length: 3 })
  defaultCurrency: string;

  @Column({ name: 'booking_instructions', type: 'text', nullable: true })
  bookingInstructions?: string | null;

  @Column({ name: 'cancellation_summary', type: 'text', nullable: true })
  cancellationSummary?: string | null;

  @Column({ name: 'preview_notice', type: 'text' })
  previewNotice: string;

  @Column({
    name: 'field_confidence',
    type: 'jsonb',
    default: () => "'{}'::jsonb",
  })
  fieldConfidence: ProfileFieldConfidence;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
