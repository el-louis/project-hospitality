# DECISIONS.md

> Project HOSPITALITY Decision Log

This document records every important architectural, product, UX, and engineering decision made throughout the lifetime of Project HOSPITALITY.

Purpose:

- Prevent repeating discussions
- Help new developers understand the project
- Give AI assistants long-term memory
- Preserve architectural consistency
- Explain *why* decisions were made, not just *what* was built

---

# Decision Template

Every decision must include:

- Decision ID
- Date
- Status
- Category
- Problem
- Options Considered
- Decision
- Reasoning
- Consequences
- Future Review

Status values

Accepted

Proposed

Deprecated

Rejected

Superseded

---

# DECISION-001

Date

2026-07-08

Status

Accepted

Category

Product Vision

Problem

Should this project be built specifically for Red Masai Apartments or as a reusable platform?

Decision

Build a reusable hospitality platform.

Reasoning

A reusable architecture allows multiple hospitality businesses to use the same software with branding customization.

Consequences

Higher initial complexity.

Massively better long-term scalability.

Future Review

Version 2.

---

# DECISION-002

Date

2026-07-08

Status

Accepted

Category

Architecture

Problem

Choose project architecture.

Options

Separate repositories

Monorepo

Decision

Monorepo.

Reasoning

Shared UI.

Shared types.

Shared utilities.

Simpler deployments.

Better developer experience.

Consequences

Slightly more setup.

Better scalability.

Future Review

Never unless significant reasons exist.

---

# DECISION-003

Category

Frontend

Problem

Choose frontend framework.

Options

React

Vue

Angular

Next.js

Decision

Next.js App Router.

Reasoning

Excellent SEO.

Server Components.

Performance.

Production maturity.

Future Review

Major Next.js release.

---

# DECISION-004

Category

Backend

Decision

NestJS.

Reasoning

Enterprise architecture.

Dependency Injection.

Scalable modules.

Excellent TypeScript support.

---

# DECISION-005

Category

Database

Decision

PostgreSQL.

Reasoning

Reliable.

Open source.

Scalable.

Excellent Prisma support.

---

# DECISION-006

Category

ORM

Decision

Prisma.

Reasoning

Developer productivity.

Type safety.

Migration system.

---

# DECISION-007

Category

Styling

Decision

Tailwind CSS.

Reasoning

Consistency.

Performance.

Reusable design tokens.

---

# DECISION-008

Date

2026-07-09

Status

Accepted

Category

Availability

Problem

The booking flow needed an explicit way to prevent reservations from being created during blocked periods.

Options Considered

- Rely on manual coordination only
- Add a lightweight in-memory availability service
- Introduce a full calendar persistence layer immediately

Decision

Implement a lightweight availability service that stores blocked date ranges and blocks booking creation when a requested stay overlaps them.

Reasoning

The milestone should be shipped quickly, verified locally, and designed to support future calendar UI and persistence without overbuilding the current foundation.

Consequences

- Bookings now reject unavailable date ranges.
- The API and frontend can expose availability state without a full database-backed calendar yet.
- Future work can expand this into a richer calendar experience and persistence layer.

Future Review

Expand when interactive date selection and owner management workflows are implemented.

---

# DECISION-009

Category

Animation

Decision

Framer Motion.

Reasoning

Accessible animations.

Modern API.

High performance.

---

# DECISION-009

Category

Forms

Decision

React Hook Form + Zod.

Reasoning

Fast.

Type-safe.

Minimal rerenders.

Excellent validation.

---

# DECISION-010

Category

Deployment

Decision

Frontend → Vercel

Backend → Railway

Database → Neon

## Milestone 4B visual-preview decision

The owner demonstration uses a temporary warm editorial visual system built from local/system fonts, CSS, existing Lucide icons and neutral media placeholders. It introduces no remote font or copied social media. Public navigation is organized by Stay, Celebrate, Experience and Create; non-stay paths remain enquiries. The concept notice, booking actions and WhatsApp actions continue to follow public flags, with backend enforcement unchanged. Final brand design and production SEO publication require owner approval.

Images → Cloudinary

Reasoning

Fast setup.

Excellent free tiers.

Modern developer experience.

---

# DECISION-011

Category

Design

Decision

Luxury through simplicity.

Reasoning

Premium hospitality relies on trust, whitespace, and photography rather than visual clutter.

---

# DECISION-012

Category

Brand

Decision

Authentically Tanzanian.

Reasoning

Avoid generic luxury aesthetics.

Represent Tanzania in a modern, respectful way through photography, materials, colors, and storytelling.

---

# DECISION-013

Category

UX

Decision

Mobile First.

Reasoning

Most users in Tanzania browse on smartphones.

Desktop is secondary.

---

# DECISION-014

Category

Booking

Decision

Booking begins within 60 seconds.

Reasoning

Reduce friction.

Every page moves the visitor closer to booking.

---

# DECISION-015

Category

Performance

Decision

Performance is a feature.

Targets

Performance >90

Accessibility >95

SEO >95

Best Practices >95

---

# DECISION-016

Category

Accessibility

Decision

WCAG AA mandatory.

Reasoning

Accessibility improves usability for everyone.

---

# DECISION-017

Category

Components

Decision

Everything reusable.

Reasoning

Never duplicate components.

Every reusable pattern belongs inside packages/ui.

---

# DECISION-018

Category

API

Decision

REST API first.

Reasoning

Simple.

Predictable.

Future GraphQL gateway possible.

---

# DECISION-019

Category

Database

Decision

Normalize data.

Reasoning

Reduce duplication.

Improve consistency.

---

# DECISION-020

Category

Security

Decision

Zero Trust.

Reasoning

Never trust client input.

Everything validated.

Everything sanitized.

---

# DECISION-021

Category

Authentication

Decision

JWT Access Token.

Refresh Token.

Role Based Access Control.

Reasoning

Industry standard.

Scalable.

Secure.

---

# DECISION-022

Category

Internationalization

Decision

Architecture prepared for multiple languages.

Initial language

English.

Future

Swahili.

French.

Arabic.

Reasoning

Future expansion across Africa.

---

# DECISION-023

Category

Multi-Tenancy

Decision

Architecture should support multiple hospitality businesses.

Reasoning

Future SaaS platform.

Each business should have:

Own branding

Own rooms

Own bookings

Own guests

Own staff

Own analytics

---

# DECISION-024

Category

Payments

Decision

Payment provider abstraction.

Reasoning

Never tightly couple to one payment provider.

Possible integrations

Flutterwave

Selcom

Stripe

Pesapal

Mobile Money

---

# DECISION-025

Category

Images

Decision

Cloudinary.

Reasoning

Automatic optimization.

Responsive images.

Fast CDN.

---

# DECISION-026

Category

Search

Decision

Server-side filtering first.

Reasoning

Simple.

SEO friendly.

Future full-text search possible.

---

# DECISION-027

Category

Documentation

Decision

Documentation is part of the product.

Every feature must update:

Architecture

API

Database

Roadmap

README

Design System

---

# DECISION-028

Category

Git

Decision

Commit every milestone.

Examples

feat:

fix:

docs:

refactor:

test:

style:

Never commit unfinished experimental work to main.

---

# DECISION-029

Category

AI Collaboration

Decision

Every AI session starts by reading:

PROJECT_RULES.md

AI_CONTEXT.md

DECISIONS.md

Reasoning

Maintain consistency.

Avoid conflicting architecture.

Prevent duplicated work.

---

# Stabilization Decisions

# DECISION-030

Date

2026-07-15

Status

Accepted

Category

Repository Tooling

Problem

The documented pnpm and Turborepo direction did not match the npm lockfiles and installed npm-based applications.

Decision

Retain npm for the current stabilization phase and use npm workspaces with one root lockfile.

Reasoning

This removes workspace ambiguity and makes dependency ownership explicit without combining stabilization with a package-manager or build-system migration.

Consequences

- The root package is private and owns both application workspaces.
- Application-level lockfiles are removed.
- pnpm and Turborepo remain possible future migrations, not current requirements.

Future Review

Reconsider only as a separately planned tooling milestone.

---

# DECISION-031

Date

2026-07-15

Status

Accepted

Category

Backend Persistence

Problem

Planning documents selected Prisma, but the working backend is implemented and tested with TypeORM.

Decision

Retain TypeORM for the current stabilization phase.

Reasoning

Replacing the ORM would be an architectural migration unrelated to repository stabilization and would put working apartment behavior at risk.

Consequences

- Existing TypeORM apartment persistence remains unchanged.
- E2e tests use a test-only `pg-mem` TypeORM data source and never connect to Neon.
- Any Prisma migration requires its own design, migration, and verification milestone.

Future Review

Before expanding persistent domain models.

---

# DECISION-032

Date

2026-07-15

Status

Accepted

Category

Frontend Fonts

Problem

Google font imports required network access during production builds, and no approved local font files existed.

Decision

Use high-quality system font stacks until licensed local assets are explicitly approved.

Reasoning

System fonts make builds deterministic and avoid adding unreviewed font binaries.

Consequences

- Production builds have no external font-network dependency.
- Brand typography may vary slightly by operating system.

Future Review

When approved brand font assets are available.

---

# DECISION-033

Date

2026-07-15

Status

Accepted

Category

Authentication

Problem

The prototype stored plaintext passwords and non-expiring custom tokens in memory and trusted client-controlled identity headers.

Decision

Persist users and refresh sessions with TypeORM, hash passwords and refresh tokens with Argon2id, issue 15-minute JWT access tokens, rotate seven-day opaque refresh tokens, and deliver browser credentials through HttpOnly SameSite cookies.

Reasoning

This separates identity proof from role authorization, supports revocation, avoids JavaScript-readable credentials, and fits the existing NestJS modular monolith.

Consequences

- The demo in-memory identity is reset rather than migrated.
- Authentication requires PostgreSQL and a mandatory JWT signing secret.
- Logout and password change revoke persisted sessions.
- Cross-site cookie deployment would require a separate CSRF design.

Future Review

Before email verification, recovery, MFA, or cross-site deployment.

---

# DECISION-034

Date

2026-07-15

Status

Accepted

Category

Database Safety

Problem

Automatic TypeORM synchronization was enabled against the configured PostgreSQL database.

Decision

Disable synchronization and manage the authentication schema through reviewed TypeORM migrations.

Reasoning

Explicit migrations preserve existing data and make schema changes reviewable and repeatable.

Consequences

- Deployments must run migrations as a controlled operational step.
- The authentication migration is additive and leaves apartment data unchanged.

Future Review

For every persistent schema change.

---

# DECISION-035

Date

2026-07-15

Status

Accepted

Category

Bookings and Availability Persistence

Problem

Bookings and manual availability ranges were held in separate process-local maps, used a hard-coded rate, and could not safely prevent concurrent reservations.

Options Considered

- Persist bookings only and remove manual blocks
- Persist manual blocks only and retain prototype bookings
- Persist both, using the apartment row as the transaction serialization point
- Add a PostgreSQL exclusion constraint requiring range and extension features

Decision

Persist bookings and manual availability blocks as normalized TypeORM entities. Active bookings and manual blocks jointly define unavailable dates. Serialize booking and blocking writes with a pessimistic lock on the owning apartment, recheck overlaps inside the transaction, and use half-open `[checkIn, checkOut)` ranges.

Reasoning

Both sources are required by the current guest and owner behavior. Apartment-row locking is supported by the existing TypeORM/PostgreSQL stack, keeps concurrency scoped per apartment, allows same-day turnover, and avoids adding an extension-dependent constraint that the isolated pg-mem suite cannot execute.

Consequences

- Pending, confirmed, and checked-in bookings block dates.
- Cancelled, checked-out, and no-show bookings do not block dates.
- Booking totals use the locked apartment nightly price and are stored as immutable snapshots.
- Public booking creation remains available; verified sessions provide optional ownership.
- Anonymous bookings cannot appear in authenticated history or be cancelled through an insecure reference-only flow.
- A real-PostgreSQL concurrency test remains required before production deployment.

Future Review

Before multi-property scaling, channel-manager integration, or distributed write paths. Consider a PostgreSQL exclusion constraint as defense in depth if operational compatibility is established.

---

# Future Decisions

Reserve this section for future architectural decisions.

Examples

Payment providers

Recommendation engine

Dynamic pricing

Multi-property support

AI concierge

WhatsApp chatbot

Channel manager

Offline mode

Native mobile apps

Microservices migration

Event-driven architecture

Analytics platform

Search engine

Caching strategy

Queue system

Monitoring

Logging

Disaster recovery

Security audits

---

# Final Principle

Good software is not built by making perfect decisions.

Good software is built by making clear decisions, documenting them, and improving them over time.

If a better decision appears in the future, create a new decision rather than rewriting history.

The goal is consistency, learning, and continuous improvement.

---

# DECISION-036

Date: 2026-07-22

Status: Accepted
Category: Product and Content Architecture

Decision: Build a single-business Red Masai Functional Concept Preview around Stay, Celebrate, Experience and Create. Persist one profile plus non-apartment offerings with internal confidence states. Keep apartment stays on the existing booking engine and route other offerings to enquiry or WhatsApp.

Consequences: owners can correct content without source edits; public pages omit internal labels; no Business, BusinessMembership, tenant switching or non-stay reservation engine is introduced; and a future migration can promote the singleton to Business and offerings to BusinessOffering.

# DECISION-037

Date: 2026-07-22

Status: Accepted
Category: Feature Management

Decision: Use a local typed environment-backed flag service with safe parsing, explicit public serialization, decorator and backend guard. Flags supplement but never replace authentication or role authorization.

Consequences: future features default disabled, malformed booleans fail closed, public clients cannot inspect internal configuration, and external flag platforms remain deferred.

# DECISION-038

Date: 2026-07-22

Status: Accepted
Category: Media Privacy and Frontend Architecture

Decision: Keep Red Masai owner-demo media local and ignored, and reference it only through a tracked typed placement catalogue guarded by a strict build-time frontend flag. Only literal `true` enables local browser paths. Reusable image/video components preserve fixed-ratio concept placeholders when disabled or unavailable. The Create video is muted, controlled and never autoplayed.

Consequences: the private Codespaces preview can tell a media-rich story while a public clone builds and runs without the ignored folder; raw paths do not spread through page code; no media, derivative, base64 copy or LFS object enters Git; and catalogue placement does not imply copyright, model consent, apartment mapping or commercial inclusion approval.

Red Masai concept media is stored locally for private owner demonstration and excluded from Git history. Public publication requires owner confirmation, ownership verification, subject-consent review and replacement or approval of any copyrighted screen, poster, broadcast or audio content.
