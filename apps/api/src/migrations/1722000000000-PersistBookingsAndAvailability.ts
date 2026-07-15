import type { MigrationInterface, QueryRunner } from 'typeorm';

export class PersistBookingsAndAvailability1722000000000 implements MigrationInterface {
  name = 'PersistBookingsAndAvailability1722000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "bookings_status_enum" AS ENUM (
        'pending', 'confirmed', 'checked_in', 'checked_out', 'cancelled', 'no_show'
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "bookings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "reference" varchar(32) NOT NULL,
        "apartment_id" uuid NOT NULL,
        "user_id" uuid,
        "guest_first_name" varchar(100) NOT NULL,
        "guest_last_name" varchar(100) NOT NULL,
        "guest_email" varchar(320) NOT NULL,
        "guest_phone" varchar(30) NOT NULL,
        "check_in" date NOT NULL,
        "check_out" date NOT NULL,
        "guest_count" integer NOT NULL,
        "nightly_rate_snapshot" numeric(12,2) NOT NULL,
        "total_amount" numeric(12,2) NOT NULL,
        "currency" varchar(3) NOT NULL DEFAULT 'USD',
        "status" "bookings_status_enum" NOT NULL DEFAULT 'pending',
        "guest_notes" text,
        "internal_notes" text,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_bookings_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_bookings_reference" UNIQUE ("reference"),
        CONSTRAINT "CK_bookings_date_range" CHECK ("check_out" > "check_in"),
        CONSTRAINT "CK_bookings_guest_count" CHECK ("guest_count" > 0),
        CONSTRAINT "CK_bookings_amounts" CHECK (
          "nightly_rate_snapshot" >= 0 AND "total_amount" >= 0
        ),
        CONSTRAINT "CK_bookings_currency" CHECK (
          char_length("currency") = 3 AND "currency" = upper("currency")
        ),
        CONSTRAINT "FK_bookings_apartment" FOREIGN KEY ("apartment_id")
          REFERENCES "apartment"("id") ON DELETE RESTRICT,
        CONSTRAINT "FK_bookings_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "availability_blocks" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "apartment_id" uuid NOT NULL,
        "start_date" date NOT NULL,
        "end_date" date NOT NULL,
        "reason" varchar(500),
        "created_by_user_id" uuid,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_availability_blocks_id" PRIMARY KEY ("id"),
        CONSTRAINT "CK_availability_blocks_date_range" CHECK ("end_date" > "start_date"),
        CONSTRAINT "FK_availability_blocks_apartment" FOREIGN KEY ("apartment_id")
          REFERENCES "apartment"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_availability_blocks_creator" FOREIGN KEY ("created_by_user_id")
          REFERENCES "users"("id") ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_apartment_dates_status" ON "bookings" ("apartment_id", "status", "check_in", "check_out")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_user_created_at" ON "bookings" ("user_id", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bookings_status" ON "bookings" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_availability_blocks_apartment_dates" ON "availability_blocks" ("apartment_id", "start_date", "end_date")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_availability_blocks_created_by" ON "availability_blocks" ("created_by_user_id")`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "availability_blocks"`);
    await queryRunner.query(`DROP TABLE "bookings"`);
    await queryRunner.query(`DROP TYPE "bookings_status_enum"`);
  }
}
