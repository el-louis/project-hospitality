import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RedMasaiConceptContent1723000000000 implements MigrationInterface {
  name = 'RedMasaiConceptContent1723000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "offerings_category_enum" AS ENUM ('STAY', 'CELEBRATE', 'EXPERIENCE', 'CREATE')
    `);
    await queryRunner.query(`
      CREATE TYPE "offerings_booking_method_enum" AS ENUM ('DIRECT_BOOKING', 'ENQUIRY', 'WHATSAPP')
    `);
    await queryRunner.query(`
      CREATE TYPE "content_confidence_enum" AS ENUM ('CONFIRMED', 'ASSUMED_DEMO', 'OWNER_REQUIRED')
    `);
    await queryRunner.query(`
      CREATE TABLE "red_masai_profile" (
        "id" smallint NOT NULL DEFAULT 1,
        "display_name" varchar(160) NOT NULL,
        "tagline" varchar(200) NOT NULL,
        "value_proposition" varchar(240) NOT NULL,
        "short_description" text NOT NULL,
        "full_description" text NOT NULL,
        "phone" varchar(30),
        "whatsapp" varchar(30),
        "email" varchar(320),
        "address" text,
        "city" varchar(120) NOT NULL,
        "region" varchar(120) NOT NULL,
        "country" varchar(120) NOT NULL,
        "latitude" numeric(10,7),
        "longitude" numeric(10,7),
        "logo_url" text,
        "cover_image_url" text,
        "instagram_url" text,
        "social_links" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "timezone" varchar(80) NOT NULL,
        "check_in_time" time,
        "check_out_time" time,
        "default_currency" varchar(3) NOT NULL,
        "booking_instructions" text,
        "cancellation_summary" text,
        "preview_notice" text NOT NULL,
        "field_confidence" jsonb NOT NULL DEFAULT '{}'::jsonb,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_red_masai_profile" PRIMARY KEY ("id"),
        CONSTRAINT "CK_red_masai_profile_singleton" CHECK ("id" = 1),
        CONSTRAINT "CK_red_masai_profile_currency" CHECK (
          char_length("default_currency") = 3 AND "default_currency" = upper("default_currency")
        )
      )
    `);
    await queryRunner.query(`
      CREATE TABLE "offerings" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "category" "offerings_category_enum" NOT NULL,
        "slug" varchar(100) NOT NULL,
        "title" varchar(160) NOT NULL,
        "short_summary" text NOT NULL,
        "full_description" text NOT NULL,
        "starting_price" numeric(12,2),
        "currency" varchar(3) NOT NULL DEFAULT 'TZS',
        "pricing_note" text,
        "capacity" integer,
        "duration_note" text,
        "included_items" jsonb NOT NULL DEFAULT '[]'::jsonb,
        "additional_charge_note" text,
        "booking_method" "offerings_booking_method_enum" NOT NULL,
        "whatsapp_action" boolean NOT NULL DEFAULT false,
        "image_url" text,
        "active" boolean NOT NULL DEFAULT true,
        "featured" boolean NOT NULL DEFAULT false,
        "display_order" integer NOT NULL DEFAULT 0,
        "content_confidence" "content_confidence_enum" NOT NULL,
        "created_at" timestamptz NOT NULL DEFAULT now(),
        "updated_at" timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "PK_offerings_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_offerings_slug" UNIQUE ("slug"),
        CONSTRAINT "CK_offerings_starting_price" CHECK ("starting_price" IS NULL OR "starting_price" >= 0),
        CONSTRAINT "CK_offerings_capacity" CHECK ("capacity" IS NULL OR "capacity" > 0),
        CONSTRAINT "CK_offerings_currency" CHECK (
          char_length("currency") = 3 AND "currency" = upper("currency")
        )
      )
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_offerings_public_order"
      ON "offerings" ("active", "category", "display_order")
    `);

    await queryRunner.query(`
      INSERT INTO "red_masai_profile" (
        "id", "display_name", "tagline", "value_proposition", "short_description", "full_description",
        "city", "region", "country", "timezone", "default_currency",
        "preview_notice", "field_confidence"
      ) VALUES (
        1,
        'Red Masai Apartments',
        'Stay, celebrate and create at Red Masai.',
        'More than a stay—a private space for your moments.',
        'Discover a private apartment and lifestyle experience in Mbezi Beach, designed for comfortable stays, romantic moments, celebrations, garden experiences and creative shoots.',
        'Red Masai Apartments is a private serviced-apartment and lifestyle-experience venue in Mbezi Beach, Dar es Salaam. It offers accommodation, private entertainment, garden experiences, intimate celebrations, group events and spaces for photography or video production. Red Masai is designed for guests who want more than somewhere to sleep—they want a private place to stay, connect, celebrate and create.',
        'Dar es Salaam',
        'Mbezi Beach',
        'Tanzania',
        'Africa/Dar_es_Salaam',
        'TZS',
        'Red Masai Digital Experience — Concept Preview. Some prices, packages and policies are included for demonstration and require owner confirmation.',
        '{
          "displayName":"OWNER_REQUIRED",
          "tagline":"ASSUMED_DEMO",
          "valueProposition":"ASSUMED_DEMO",
          "shortDescription":"ASSUMED_DEMO",
          "fullDescription":"ASSUMED_DEMO",
          "phone":"OWNER_REQUIRED",
          "whatsapp":"OWNER_REQUIRED",
          "email":"OWNER_REQUIRED",
          "address":"OWNER_REQUIRED",
          "city":"CONFIRMED",
          "region":"CONFIRMED",
          "country":"CONFIRMED",
          "latitude":"OWNER_REQUIRED",
          "longitude":"OWNER_REQUIRED",
          "logoUrl":"OWNER_REQUIRED",
          "coverImageUrl":"OWNER_REQUIRED",
          "instagramUrl":"OWNER_REQUIRED",
          "socialLinks":"OWNER_REQUIRED",
          "timezone":"ASSUMED_DEMO",
          "checkInTime":"OWNER_REQUIRED",
          "checkOutTime":"OWNER_REQUIRED",
          "defaultCurrency":"ASSUMED_DEMO",
          "bookingInstructions":"OWNER_REQUIRED",
          "cancellationSummary":"OWNER_REQUIRED",
          "previewNotice":"CONFIRMED"
        }'::jsonb
      ) ON CONFLICT ("id") DO NOTHING
    `);

    await queryRunner.query(`
      INSERT INTO "offerings" (
        "id", "category", "slug", "title", "short_summary", "full_description",
        "starting_price", "currency", "pricing_note", "capacity", "duration_note",
        "included_items", "additional_charge_note", "booking_method", "whatsapp_action",
        "active", "featured", "display_order", "content_confidence"
      ) VALUES
      (
        '10000000-0000-4000-8000-000000000001', 'EXPERIENCE', 'private-cinema-experience',
        'Private Cinema Experience',
        'Relax together in a private cinema-style space with comfortable seating, films, snacks and an intimate atmosphere.',
        'Plan a relaxed private cinema-style moment for a couple or small group. Film access, snacks, drinks, capacity and session length require owner confirmation.',
        NULL, 'TZS', 'Price requires owner confirmation.', NULL, 'Session duration requires owner confirmation.',
        '["Private cinema-style setting"]'::jsonb,
        'Food, drinks and other additions may carry a separate charge; confirmation is required.',
        'ENQUIRY', true, true, true, 10, 'ASSUMED_DEMO'
      ),
      (
        '10000000-0000-4000-8000-000000000002', 'EXPERIENCE', 'garden-picnic',
        'Garden Picnic',
        'Enjoy a private garden setup for couples or small groups, with space for snacks, drinks and relaxed games.',
        'A private garden experience for a calm afternoon, romantic moment or small gathering. Capacity and inclusions are demonstration content.',
        100000, 'TZS', 'Standalone concept price; apartment-guest setup may start around TZS 30,000. Confirm both prices with the owner.',
        NULL, NULL, '[]'::jsonb,
        'Food, drinks, games and setup details require confirmation.',
        'ENQUIRY', true, true, true, 20, 'ASSUMED_DEMO'
      ),
      (
        '10000000-0000-4000-8000-000000000003', 'EXPERIENCE', 'romantic-garden-dinner',
        'Romantic Garden Dinner',
        'A private outdoor dinner setting designed for couples, anniversaries and special moments.',
        'Share the occasion you are planning and Red Masai can confirm the available setting, timing, menu options and additions.',
        NULL, 'TZS', 'Pricing requires owner confirmation.', 2, NULL, '[]'::jsonb,
        'Dining, décor and entertainment inclusions require owner confirmation.',
        'ENQUIRY', true, true, true, 30, 'OWNER_REQUIRED'
      ),
      (
        '10000000-0000-4000-8000-000000000004', 'CELEBRATE', 'private-celebrations',
        'Private Celebrations',
        'Celebrate birthdays, engagements, showers, anniversaries and intimate gatherings in a private setting.',
        'Explore a private setting for personal, staff, VICOBA, community or small corporate gatherings. Capacity, event hours, setup fees and house rules require owner confirmation.',
        NULL, 'TZS', 'Pricing and setup charges require owner confirmation.', NULL, NULL, '[]'::jsonb,
        'Décor, cleaning, catering and extended-hour charges require confirmation.',
        'ENQUIRY', true, true, true, 40, 'OWNER_REQUIRED'
      ),
      (
        '10000000-0000-4000-8000-000000000005', 'CREATE', 'creative-shoots',
        'Creative Shoots',
        'Use Red Masai’s indoor and outdoor spaces for photography, video production and social-media content.',
        'Tell the team about your shoot type, preferred spaces, crew size and timing. Equipment rules, duration and commercial pricing require owner confirmation.',
        NULL, 'TZS', 'Pricing requires owner confirmation.', NULL, NULL, '[]'::jsonb,
        'Equipment, power, changing space and overtime terms require confirmation.',
        'ENQUIRY', true, true, true, 50, 'OWNER_REQUIRED'
      )
      ON CONFLICT ("id") DO NOTHING
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "offerings"`);
    await queryRunner.query(`DROP TABLE "red_masai_profile"`);
    await queryRunner.query(`DROP TYPE "content_confidence_enum"`);
    await queryRunner.query(`DROP TYPE "offerings_booking_method_enum"`);
    await queryRunner.query(`DROP TYPE "offerings_category_enum"`);
  }
}
