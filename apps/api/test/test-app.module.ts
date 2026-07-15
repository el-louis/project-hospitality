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
`);

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        entities: [Apartment, User, AuthSession, Booking, AvailabilityBlock],
        synchronize: false,
        retryAttempts: 1,
      }),
      dataSourceFactory: async (options) =>
        database.adapters.createTypeormDataSource(options).initialize(),
    }),
    ApartmentsModule,
    AuthModule,
    AvailabilityModule,
    BookingsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class TestAppModule {}
