# Bookings and Availability

Date: 2026-07-15

## Scope and Status

Milestone 3 replaces process-local booking and availability maps with PostgreSQL-backed TypeORM entities. The additive migration is implemented and tested locally but is intentionally not applied to Neon or another remote database in this milestone.

Payments, marketplace discovery, multi-tenancy, reviews, analytics, identity documents, and channel-manager integration are out of scope.

## Schema

### `bookings`

- UUID primary key.
- Unique, indexed `RM-YYYYMMDD-XXXXXXXXXXXX` reference generated from cryptographically random bytes.
- Required apartment foreign key with `ON DELETE RESTRICT`.
- Optional authenticated-user foreign key with `ON DELETE SET NULL`.
- Guest first name, last name, email, and phone required by the current booking operation.
- `date` check-in and check-out with a database check requiring checkout after check-in.
- Positive guest count.
- `numeric(12,2)` nightly price snapshot and total amount calculated by the API.
- Exactly three uppercase currency characters enforced by a database check, currently `USD` to match the existing apartment prices and UI.
- Booking status enum.
- Optional guest and internal notes. Internal notes are not currently writable through the public API.
- Created and updated timestamps.

Indexes cover unique references, apartment/status/date overlap queries, user booking history, and status filtering.

### `availability_blocks`

- UUID primary key.
- Required apartment foreign key with `ON DELETE CASCADE`.
- Start and end `date` values with a database check requiring end after start.
- Optional operational reason.
- Optional creator-user foreign key with `ON DELETE SET NULL`.
- Created and updated timestamps.

Indexes cover apartment/date overlap queries and creator lookup.

No prior in-memory booking or block records are migrated because they are not durable.

## Availability Source of Truth

An apartment is unavailable when a requested range overlaps either:

- a booking in `pending`, `confirmed`, or `checked_in`; or
- a persisted manual availability block.

`cancelled`, `checked_out`, and `no_show` bookings do not block dates. Deleting a manual block releases its dates. Public availability responses contain dates and source labels but no guest identity or booking reference.

## Dates, Pricing, and Overlap

Dates must be strict `YYYY-MM-DD` calendar dates. Check-in cannot be in the past, and checkout must be later than check-in.

All ranges use `[checkIn, checkOut)`. A stay ending on a date does not overlap a stay beginning on that date, so same-day turnover is allowed.

Overlap is:

`existing.start < requested.end AND existing.end > requested.start`

The backend calculates nights and total amount from the validated dates and the locked apartment `pricePerNight`. Client-provided totals and price values are not accepted. The nightly rate and total are stored as booking-time snapshots.

## Concurrency and Integrity

Booking creation and manual blocking run inside database transactions. Each transaction obtains a PostgreSQL `pessimistic_write` lock on the apartment row, checks active booking and block overlaps, and writes only if the range remains free.

This serializes competing writes for the same apartment while allowing unrelated apartments to proceed concurrently. The foreign keys, checks, unique reference constraint, and indexes provide durable structural integrity. The isolated pg-mem suite exercises simultaneous requests, while real PostgreSQL lock behavior remains a required pre-production integration check.

## Booking Lifecycle

Allowed staff transitions:

| Current       | Allowed next states                  |
| ------------- | ------------------------------------ |
| `pending`     | `confirmed`, `cancelled`             |
| `confirmed`   | `checked_in`, `cancelled`, `no_show` |
| `checked_in`  | `checked_out`                        |
| `checked_out` | none                                 |
| `cancelled`   | none                                 |
| `no_show`     | none                                 |

Authenticated owners of a booking may cancel only while the lifecycle permits cancellation. Owner/admin staff may perform the same cancellation and may apply any valid transition. Invalid and repeated transitions return conflict responses.

## Authorization and Privacy

- `POST /bookings` remains public and optionally associates the booking with identity verified from the authentication session.
- Client-supplied user IDs are not accepted.
- `GET /bookings/me` returns only bookings whose persisted user foreign key matches the verified session.
- Anonymous bookings never appear in `/bookings/me`.
- `GET /bookings/reference/:reference` is authenticated and returns a result only to the booking owner or owner/admin staff.
- `GET /bookings` and `PATCH /bookings/:reference/status` require owner/admin.
- `POST /bookings/:reference/cancel` requires the persisted booking owner or owner/admin.
- Manual block creation/removal requires owner/admin.

Guest/self-service and staff listing responses use privacy-safe booking summaries. They do not expose guest email, phone, notes, internal database IDs, user IDs, or another guest's personal details. Full guest payloads, authentication tokens, and contact details must not be logged.

## Endpoint Behavior

- `POST /bookings`: creates a pending booking and returns only message, reference, total, currency, and status.
- `GET /bookings/me`: authenticated current-user history.
- `GET /bookings/reference/:reference`: protected owner/staff lookup.
- `GET /bookings`: owner/admin listing.
- `PATCH /bookings/:reference/status`: owner/admin lifecycle update.
- `POST /bookings/:reference/cancel`: authenticated ownership/staff cancellation.
- `GET /availability/:apartmentId`: public unavailable booking and manual ranges.
- `POST /availability/:apartmentId/blocks`: owner/admin manual block creation.
- `DELETE /availability/:apartmentId/blocks/:blockId`: owner/admin manual block removal.

Expected validation failures use `400`, unavailable overlaps and lifecycle conflicts use `409`, missing resources use `404`, unauthenticated requests use `401`, and unauthorized operations use `403` or a privacy-preserving not-found response.

## Migration

`PersistBookingsAndAvailability1722000000000` creates the booking-status enum, `bookings`, `availability_blocks`, their checks, foreign keys, unique reference, and indexes. It does not alter or delete apartments, users, authentication sessions, or their migration history.

`down()` drops the two milestone-owned tables and booking-status enum. Running it would permanently delete persisted booking and manual-block records, so rollback requires the same backup and review discipline as any destructive database operation.

TypeORM `synchronize` remains disabled. Applying this migration to Neon is a separate, explicitly approved operational step.

## Test Strategy

- Unit tests cover strict dates, past-date rejection, half-open turnover, lifecycle transitions, and additive migration consequences.
- Isolated e2e tests use pg-mem only and never load Neon configuration.
- E2e coverage includes persistence, random unique references, authenticated association, anonymous creation, history ownership, backend totals, invalid dates, overlaps, concurrent requests, cancellation release, manual blocks, authorization, lifecycle transitions, privacy-safe responses, and schema metadata.
- Backend e2e is run with `--detectOpenHandles`.
- Backend/frontend lint and production builds remain milestone gates.

## Deferred Payment Integration

No payment status, processor identifiers, webhooks, checkout flow, or payment events are implemented. The booking total and currency snapshots provide the minimum stable inputs for a separately designed payment milestone. Provider abstraction, idempotency, reconciliation, refunds, and payment-state transitions must be designed before adding payment persistence.
