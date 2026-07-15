# Stabilization Report

Date: 2026-07-15

## Objective

Prepare the existing implementation for an initial safe repository checkpoint without adding product features or redesigning prototype authentication.

## Changes

- Established the root repository as the sole Git boundary for both applications.
- Kept `apps/web/src/app/(public)/page.tsx` as the sole `/` route and removed the conflicting root page.
- Retained the top-level Next.js root layout.
- Replaced externally fetched Google fonts with system sans-serif and serif stacks.
- Added explicit Nest module imports so guards can resolve `AuthService` where they are used.
- Added a test-only Nest application module using an isolated `pg-mem` TypeORM data source.
- Made e2e teardown conditional on successful application initialization.
- Converted dependency management to npm workspaces with one root lockfile.
- Retained the implemented TypeORM stack for stabilization; no Prisma migration was attempted.

## Scope Boundaries

- No new user-facing feature was added.
- Apartment and booking behavior was preserved.
- Prototype authentication behavior was not expanded or presented as production-ready.
- No commit or push was performed.

## Verification

- Backend unit tests: 6 suites and 18 tests passed.
- Backend e2e tests: 1 suite and 1 test passed with open-handle detection enabled.
- Backend production build: passed.
- Frontend production build: compiled, type-checked, and generated all routes without external font requests.
- Route manifest: exactly one application page maps to `/`.
- Ignore checks: `.env`, dependencies, build output, coverage, and logs remain ignored.

The restricted sandbox blocks ephemeral local ports used internally by Supertest and Turbopack. Their final verification commands passed outside that process restriction. The e2e database remained an in-memory `pg-mem` instance, and the frontend contains no Google-font import or remote CSS font import.
