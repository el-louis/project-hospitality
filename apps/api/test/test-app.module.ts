import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataType, newDb } from 'pg-mem';
import { Apartment } from '../src/apartments/apartment.entity';
import { ApartmentsModule } from '../src/apartments/apartments.module';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthSession } from '../src/auth/auth-session.entity';
import { AuthModule } from '../src/auth/auth.module';
import { AvailabilityModule } from '../src/availability/availability.module';
import { AvailabilityBlock } from '../src/availability/availability-block.entity';
import { Booking } from '../src/bookings/booking.entity';
import { BookingsModule } from '../src/bookings/bookings.module';
import { User } from '../src/users/user.entity';
import { UsersModule } from '../src/users/users.module';
import { FeaturesModule } from '../src/features/features.module';
import { RedMasaiProfile } from '../src/red-masai/red-masai-profile.entity';
import { RedMasaiModule } from '../src/red-masai/red-masai.module';
import { Offering } from '../src/offerings/offering.entity';
import { OfferingsModule } from '../src/offerings/offerings.module';
import { DashboardModule } from '../src/dashboard/dashboard.module';

process.env.JWT_ACCESS_SECRET = 'e2e-only-secret-at-least-32-characters-long';
const database = newDb();
database.public.registerFunction({
  name: 'version',
  returns: DataType.text,
  implementation: () => 'PostgreSQL 16.0',
});
database.public.registerFunction({
  name: 'current_database',
  returns: DataType.text,
  implementation: () => 'hospitality_e2e',
});
database.public.registerFunction({
  name: 'gen_random_uuid',
  returns: DataType.uuid,
  implementation: randomUUID,
  impure: true,
});
database.public.registerFunction({
  name: 'char_length',
  args: [DataType.text],
  returns: DataType.integer,
  implementation: (value: string) => value.length,
});
database.public.registerFunction({
  name: 'upper',
  args: [DataType.text],
  returns: DataType.text,
  implementation: (value: string) => value.toUpperCase(),
});
database.public.none(`
  CREATE TABLE apartment (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), title text NOT NULL, description text NOT NULL,
    "pricePerNight" integer NOT NULL, "maxGuests" integer NOT NULL, bedrooms integer NOT NULL,
    bathrooms integer NOT NULL, "hasKitchen" boolean NOT NULL DEFAULT false,
    "hasWiFi" boolean NOT NULL DEFAULT false, "hasParking" boolean NOT NULL DEFAULT false,
    location text NOT NULL, status text NOT NULL DEFAULT 'available',
    "createdAt" timestamp NOT NULL DEFAULT now(), "updatedAt" timestamp NOT NULL DEFAULT now()
  );
  CREATE TABLE users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL, email varchar(320) UNIQUE NOT NULL, phone varchar(30),
    password_hash text NOT NULL, role text NOT NULL DEFAULT 'user', status text NOT NULL DEFAULT 'active',
    email_verified boolean NOT NULL DEFAULT false, last_login_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE TABLE auth_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash text NOT NULL, expires_at timestamptz NOT NULL, revoked_at timestamptz,
    replaced_by_session_id uuid, created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE TABLE bookings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), reference varchar(32) UNIQUE NOT NULL,
    apartment_id uuid NOT NULL REFERENCES apartment(id) ON DELETE RESTRICT,
    user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    guest_first_name varchar(100) NOT NULL, guest_last_name varchar(100) NOT NULL,
    guest_email varchar(320) NOT NULL, guest_phone varchar(30) NOT NULL,
    check_in date NOT NULL, check_out date NOT NULL, guest_count integer NOT NULL,
    nightly_rate_snapshot numeric(12,2) NOT NULL, total_amount numeric(12,2) NOT NULL,
    currency varchar(3) NOT NULL DEFAULT 'USD', status text NOT NULL DEFAULT 'pending',
    guest_notes text, internal_notes text, created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(), CHECK (check_out > check_in),
    CHECK (guest_count > 0), CHECK (nightly_rate_snapshot >= 0 AND total_amount >= 0),
    CHECK (char_length(currency) = 3 AND currency = upper(currency))
  );
  CREATE INDEX IDX_bookings_apartment_dates_status ON bookings(apartment_id, status, check_in, check_out);
  CREATE INDEX IDX_bookings_user_created_at ON bookings(user_id, created_at);
  CREATE INDEX IDX_bookings_status ON bookings(status);
  CREATE TABLE availability_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    apartment_id uuid NOT NULL REFERENCES apartment(id) ON DELETE CASCADE,
    start_date date NOT NULL, end_date date NOT NULL, reason varchar(500),
    created_by_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
    CHECK (end_date > start_date)
  );
  CREATE INDEX IDX_availability_blocks_apartment_dates ON availability_blocks(apartment_id, start_date, end_date);
  CREATE INDEX IDX_availability_blocks_created_by ON availability_blocks(created_by_user_id);
  CREATE TABLE red_masai_profile (
    id smallint PRIMARY KEY DEFAULT 1, display_name varchar(160) NOT NULL,
    tagline varchar(200) NOT NULL, value_proposition varchar(240) NOT NULL,
    short_description text NOT NULL, full_description text NOT NULL,
    phone varchar(30), whatsapp varchar(30), email varchar(320), address text,
    city varchar(120) NOT NULL, region varchar(120) NOT NULL, country varchar(120) NOT NULL,
    latitude numeric(10,7), longitude numeric(10,7), logo_url text, cover_image_url text,
    instagram_url text, social_links jsonb NOT NULL DEFAULT '{}', timezone varchar(80) NOT NULL,
    check_in_time time, check_out_time time, default_currency varchar(3) NOT NULL,
    booking_instructions text, cancellation_summary text, preview_notice text NOT NULL,
    field_confidence jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now(), CHECK (id = 1)
  );
  CREATE TABLE offerings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(), category text NOT NULL, slug varchar(100) UNIQUE NOT NULL,
    title varchar(160) NOT NULL, short_summary text NOT NULL, full_description text NOT NULL,
    starting_price numeric(12,2), currency varchar(3) NOT NULL DEFAULT 'TZS', pricing_note text,
    capacity integer, duration_note text, included_items jsonb NOT NULL DEFAULT '[]',
    additional_charge_note text, booking_method text NOT NULL, whatsapp_action boolean NOT NULL DEFAULT false,
    image_url text, active boolean NOT NULL DEFAULT true, featured boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0, content_confidence text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
  );
  CREATE INDEX IDX_offerings_public_order ON offerings(active, category, display_order);
  INSERT INTO red_masai_profile (
    id, display_name, tagline, value_proposition, short_description, full_description, city, region, country,
    timezone, default_currency, preview_notice, field_confidence
  ) VALUES (
    1, 'Red Masai Apartments', 'Stay, celebrate and create at Red Masai.',
    'More than a stay—a private space for your moments.', 'Concept supporting copy.', 'Database-backed concept profile.',
    'Dar es Salaam', 'Mbezi Beach', 'Tanzania', 'Africa/Dar_es_Salaam', 'TZS',
    'Red Masai Digital Experience — Concept Preview.', '{"displayName":"OWNER_REQUIRED"}'
  );
  INSERT INTO offerings (
    id, category, slug, title, short_summary, full_description, currency, included_items,
    booking_method, whatsapp_action, active, featured, display_order, content_confidence
  ) VALUES
    ('10000000-0000-4000-8000-000000000001', 'EXPERIENCE', 'private-cinema-experience',
     'Private Cinema Experience', 'Cinema summary', 'Cinema details', 'TZS', '[]', 'ENQUIRY', true, true, true, 10, 'ASSUMED_DEMO'),
    ('10000000-0000-4000-8000-000000000002', 'CREATE', 'creative-shoots',
     'Creative Shoots', 'Shoot summary', 'Shoot details', 'TZS', '[]', 'ENQUIRY', true, true, false, 20, 'OWNER_REQUIRED'),
    ('10000000-0000-4000-8000-000000000003', 'CELEBRATE', 'inactive-event',
     'Inactive Event', 'Hidden summary', 'Hidden details', 'TZS', '[]', 'ENQUIRY', false, false, false, 30, 'OWNER_REQUIRED');
`);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [
          Apartment,
          User,
          AuthSession,
          Booking,
          AvailabilityBlock,
          RedMasaiProfile,
          Offering,
        ],
        synchronize: false,
        retryAttempts: 1,
      }),
      dataSourceFactory: async (options) =>
        database.adapters.createTypeormDataSource(options).initialize(),
    }),
    ApartmentsModule,
    FeaturesModule,
    AuthModule,
    AvailabilityModule,
    BookingsModule,
    UsersModule,
    RedMasaiModule,
    OfferingsModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
