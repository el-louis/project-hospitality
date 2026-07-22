# Codebase Audit

Date: 2026-07-22

## Scope

This audit records the read-only baseline established before the first repository checkpoint and the repository-boundary repair that followed it.

## Repository State

- The root Git repository is the canonical repository.
- A nested, uncommitted `apps/api/.git` directory was moved intact to `/tmp/project-hospitality-api-git-backup` so the root repository can track the backend.
- Secrets, dependencies, build output, coverage, and logs are ignored.
- The project now uses npm workspaces with a single root lockfile.

## Implemented Architecture

- `apps/web`: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS.
- `apps/api`: NestJS 11, TypeORM, PostgreSQL, TypeScript.
- `packages/ui` and `packages/types`: reserved but not yet active shared packages.
- Apartment records use PostgreSQL through TypeORM.
- Users and authentication sessions are persisted through TypeORM.
- Milestone 3 persists bookings and manual availability blocks through reviewed TypeORM entities and an additive migration applied to development Neon.
- Milestone 4A content is applied to development Neon; Milestone 4B adds a frontend-only visual and owner-demo layer with responsive public paths, neutral media placeholders, accessibility improvements and a grouped protected review experience. No production deployment or backend-domain expansion is included.

## Verified Working Behavior

- Apartment CRUD API and apartment listing/detail UI.
- Booking request form, backend-calculated totals, persisted booking history, cancellation, lifecycle transitions, and database-backed availability checks.
- Argon2id registration/login, rotated refresh sessions, authenticated profiles, booking ownership, and role guards.
- Backend unit suite and isolated backend e2e smoke test.
- Backend and frontend production builds.

## Material Risks

- The booking/availability migration remains unapplied to production and requires a separate controlled deployment operation.
- Email verification, recovery, MFA, distributed rate limiting, and deployment-specific security testing are deferred.
- The authentication migration has not been applied to a production database.
- Backend TypeScript settings are less strict than the project rules require.
- The design-system, architecture, API, and database documents referenced by the project instructions are not yet present.
- The current UI remains an early implementation and has not completed accessibility, security, SEO, or performance audits.

## Dependency and Build Risks

- The Milestone 2 dependency installation reported no known npm vulnerabilities at installation time; ongoing monitoring remains required.
- System font stacks are used because no approved local font binaries exist and production builds must not require font downloads.
- The isolated e2e database is an in-memory PostgreSQL-compatible `pg-mem` instance. Real development PostgreSQL verified apartment-lock concurrency and exposed an outer-join `FOR UPDATE` restriction that pg-mem did not model. Status changes therefore lock relation-free booking rows and load apartments separately, protected by a structural regression test.

## Milestone 4A Addendum

- Red Masai profile and non-apartment offerings are database-backed through an additive, currently unapplied migration.
- Typed feature guards protect booking, availability, dashboard and content capabilities without weakening role authorization.
- Public routes communicate Stay, Celebrate, Experience and Create; non-stay paths use real contact actions rather than fake reservations.
- Owner/admin users have a protected content-review interface; ordinary users cannot access its APIs.
- Seed copy, contact details, location, policies, capacities and most non-stay prices/inclusions require owner review before production.
