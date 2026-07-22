# Authentication and Authorization

Date: 2026-07-15

## Status

This document describes the Milestone 2 authentication foundation. It is production-oriented but must not be called production-ready until the migration is applied in a controlled environment, HTTPS and deployment secrets are configured, and deployment-specific security testing is complete.

## Identity Model

`users` is the persisted identity table. Each user has a UUID, first and last name, normalized unique email, optional phone, Argon2id password hash, role, account status, email-verification flag, last-login timestamp, and audit timestamps.

Public registration always assigns the `user` role and `active` status. Clients cannot set roles, account status, email-verification state, internal IDs, or timestamps. Email verification is represented in the schema but delivery and verification flows are deferred.

`auth_sessions` stores refresh-session state. It contains the owning user, an Argon2id hash of the opaque refresh token, expiry and revocation timestamps, and rotation linkage. Refresh tokens are never stored plaintext.

## Password Hashing

Passwords use Argon2id with a 19 MiB memory cost, two iterations, and one lane. Registration and password changes hash before persistence. Login uses constant-work Argon2 verification when a user exists and returns a generic error for invalid credentials. Password hashes use `select: false` and are explicitly selected only for credential verification.

Passwords must be 12–128 characters and contain uppercase, lowercase, and numeric characters. Passwords, hashes, tokens, and secrets must never be logged or returned by APIs.

## Token and Session Lifecycle

- Access token: signed JWT, 15-minute expiry, containing user ID, session ID, email, and role claims.
- Refresh token: 48 random bytes plus its session UUID, seven-day expiry.
- Each authenticated request verifies the JWT, confirms that its persisted session is active, confirms the account is active, and derives the current role and email from the database.
- Refresh rotates the token into a new session and revokes the previous session. Reuse of a rotated token fails.
- Logout revokes the persisted session, invalidating both its refresh token and any remaining access-token lifetime.
- Password change verifies the current password, stores a new Argon2id hash, and revokes all user sessions.

## Browser Cookie Strategy

The browser receives access and refresh credentials only in `HttpOnly`, `SameSite=Lax` cookies. JavaScript cannot read them, and no token is stored in `localStorage` or a query string. The access cookie is available to API paths; the refresh cookie is restricted to `/auth`.

Cookies are always `Secure` in production. Local HTTP development may set `COOKIE_SECURE=false`. Credentialed CORS accepts only origins listed in `CORS_ORIGINS`.

`SameSite=Lax` materially reduces cross-site request forgery for mutating requests. If the frontend and API are later deployed cross-site and `SameSite=None` becomes necessary, an explicit CSRF-token design is required before changing the cookie policy.

## Authorization Model

Authentication proves identity through `AuthorizationGuard`. Authorization uses `RolesGuard` and `@Roles` after authentication. Client-controlled `x-role` and `x-user-id` values are ignored.

Roles:

- `user`: self-service profile and booking history.
- `owner`: apartment/availability management and authorized cross-user booking review.
- `admin`: the same protected management foundation, reserved for platform administration.

The server derives self-service ownership from the authenticated principal:

- `GET/PATCH /users/me`
- `GET /bookings/me`
- `GET /auth/me`

There is no arbitrary user-ID profile endpoint. Ordinary users cannot write protected identity fields. Apartment create/update/delete and availability mutation require `owner` or `admin`. Public apartment reads and public booking creation remain available.

## API Endpoints

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/change-password`
- `GET /users/me`
- `PATCH /users/me`
- `GET /bookings/me`
- `GET /bookings/user/:userId` (`owner` or `admin`)

Register, login, refresh, and password change are rate-limited. Global DTO validation whitelists known fields, rejects unknown fields, and transforms validated input. Helmet supplies standard security headers.

## Environment Variables

- `JWT_ACCESS_SECRET`: mandatory signing secret, at least 32 characters; use cryptographically random production material.
- `CORS_ORIGINS`: comma-separated allowed browser origins.
- `COOKIE_SECURE`: local HTTPS override; production forces secure cookies.
- `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL`: PostgreSQL connection.

`DB_SSL` is parsed strictly. `true` enables TLS with Node's trusted system certificate authorities and hostname verification; `false` is accepted only for an explicitly local loopback database. Remote Neon connections must never use `rejectUnauthorized: false`.

See `apps/api/.env.example`. Never commit real values.

## Database Migration

`SecureAuthenticationFoundation1721000000000` creates `users`, `auth_sessions`, enums, foreign keys, and session indexes. `synchronize` is disabled. The migration does not alter apartments or bookings.

Prototype users were in memory and have no durable records to migrate. They are intentionally reset. Run migrations only after reviewing the target database and backing it up. This milestone did not apply a migration to Neon or any remote database.

## Threat Assumptions

- Production uses HTTPS end-to-end.
- Deployment secrets are supplied through a secret manager and are not shared across environments.
- PostgreSQL access is restricted to the API.
- XSS remains relevant even with `HttpOnly` cookies because malicious script can issue same-origin actions; CSP and ongoing frontend security review remain important.
- Distributed rate limiting may be required when the API scales beyond one process.

## Test Strategy

Unit tests cover hashing, duplicate registration, invalid login, public-user serialization, role checks, and header-bypass removal. E2e tests use an isolated `pg-mem` schema with test-only secrets and never read Neon configuration. They cover registration, duplicate rejection, password non-disclosure, valid/invalid login, unauthenticated and authenticated access, invalid/expired tokens, refresh rotation, logout revocation, profile ownership, escalation rejection, protected mutations, and booking-history ownership.

## Deferred Work

- Email verification delivery and token flow.
- Account recovery and forgotten-password flow.
- Multi-factor authentication.
- Distributed rate-limit storage and session-management UI.
- Audit-event persistence and security monitoring.
- Deployment-specific CSP, proxy, HTTPS, and penetration testing.

## Milestone 4A content authorization

Protected Red Masai profile, offering-management and dashboard-summary endpoints require the existing verified session plus `owner` or `admin`. Feature guards (`contentManagement` or `staffDashboard`) never substitute for identity or role checks. Frontend redirects are usability controls only.

Content DTOs reject unknown fields, preventing flags, roles, secrets or auth settings from being written through content APIs. No role headers, localStorage credentials or fallback secrets were introduced.
