# AI_CONTEXT.md

# Project HOSPITALITY

> Master AI Context Document

Version: 0.1.0

Last Updated: July 2026

---

# Project Identity

Project Name

Project HOSPITALITY

Category

Hospitality SaaS Platform

Industry

Travel
Hospitality
Property Management
Booking

Current Client

Red Masai Apartments
Dar es Salaam
Tanzania

Future Vision

Project HOSPITALITY should become a reusable hospitality platform that serves:

Apartments

Hotels

Lodges

Guest Houses

Resorts

Vacation Rentals

Airbnb Hosts

Boutique Hotels

The architecture must never be limited to one client.

Always design for multiple businesses.

---

# Current Verified Status

The repository is the source of truth for project progress.

Verified completed work in the current workspace:

- Monorepo architecture
- NestJS backend
- Next.js frontend
- PostgreSQL integration
- Apartment CRUD
- Homepage
- Apartment details page
- Frontend to backend integration
- Booking workflow
- Booking API
- Booking form
- Booking confirmation
- Availability rules and calendar blocking
- API validation
- Local testing passing
- Production builds passing
- Root Git repository now tracks both applications without a nested backend repository boundary
- npm workspace dependency management with one root lockfile
- Duplicate homepage route ownership resolved
- Frontend production build no longer requires external font downloads
- Backend e2e smoke test uses an isolated in-memory PostgreSQL-compatible database

Verified remaining work:

- Persist bookings in PostgreSQL
- Expand availability calendar UI with interactive date selection
- Authentication
- Authorization
- User accounts
- Property owner workflows
- Admin dashboard
- Payments
- Reviews
- Search and filters
- Wishlist
- Notifications
- Analytics
- SEO
- Accessibility audit
- Performance optimization
- Testing
- Production-grade authentication and authorization (the current implementation is an insecure in-memory prototype)
- Real PostgreSQL integration testing
- Deployment

Recommended next milestone:

Create a safe initial Git checkpoint for the verified stabilization work. After that checkpoint, plan production-grade authentication as a separate milestone; do not extend the current prototype.

Roadmap sequence:

Persist bookings in PostgreSQL → Authentication → Authorization → User accounts and profiles → Link bookings to authenticated users → Expand availability calendar UI → Property management → Payments → Admin dashboard → Reviews and ratings → Notifications → Search and filters → Analytics → SEO → Performance and accessibility → Testing → Production deployment

---

# Product Vision

Create the simplest, cleanest and most trustworthy hospitality platform in Tanzania.

The website should feel premium without feeling expensive.

Users should trust the property before they finish scrolling.

Booking should require minimal effort.

Every interaction should reduce friction.

---

# Brand Vision

Modern Tanzanian Hospitality.

The experience should combine

international product quality

with

genuine Tanzanian hospitality.

Never imitate European luxury.

Celebrate local identity through subtle design rather than stereotypes.

---

# Brand Personality

Refined

Welcoming

Authentically Tanzanian

Modern

Trustworthy

Peaceful

Inclusive

---

# Emotional Goals

Visitors should feel

Safe

Comfortable

Relaxed

Confident

Excited

before booking.

---

# Primary Users

Business Traveler

Needs

Reliable WiFi

Parking

Quiet rooms

Fast booking

Invoices

---

Tourist

Needs

Beautiful rooms

Easy booking

Great location

Reviews

Gallery

---

Family

Needs

Kitchen

Space

Safety

Multiple beds

Nearby services

---

Property Owner

Needs

Easy management

Simple dashboard

Booking control

Revenue visibility

Minimal technical knowledge

---

# Business Goals

Increase direct bookings.

Reduce dependency on third-party platforms.

Improve guest trust.

Improve booking conversion.

Provide an easy management system.

Create a reusable software platform.

---

# Success Metrics

Visitors understand the property in under 10 seconds.

Booking journey begins within 60 seconds.

High mobile usability.

Lighthouse

Performance >90

Accessibility >95

SEO >95

Best Practices >95

Minimal support requests.

Fast page loading.

---

# Technology Stack

Frontend

Next.js

App Router

TypeScript

Tailwind CSS

Framer Motion

React Hook Form

Zod

Backend

NestJS

Prisma ORM

PostgreSQL

Deployment

Vercel

Railway

Neon PostgreSQL

Cloudinary

Development

Turborepo

pnpm

GitHub Codespaces

GitHub Copilot

---

# Repository Structure

apps/

api/

web/

packages/

ui/

types/

config/

utils/

docs/

.github/

scripts/

No unnecessary folders.

---

# Design Philosophy

Luxury through simplicity.

Whitespace creates elegance.

Typography creates hierarchy.

Photography creates trust.

Animations support usability.

Never decorate for decoration's sake.

---

# Color Palette

Primary

Deep Forest Green

Secondary

Warm Sand

Accent

Copper Bronze

Neutral

White

Off White

Light Stone

Charcoal

Only use design tokens.

---

# Typography

Headings

Playfair Display

Body

Inter

Readable.

Elegant.

Accessible.

---

# Design Principles

Large spacing.

Simple navigation.

Minimal clicks.

Consistent layouts.

Reusable components.

Mobile-first.

Accessibility-first.

Performance-first.

---

# User Experience Principles

The homepage must answer

What is this?

Can I trust it?

Can I book?

Apartment pages must answer

What do I get?

How much?

Where is it?

Can I book now?

Every page should move users closer to booking.

---

# Booking Philosophy

Booking should feel effortless.

Minimum clicks.

Minimum typing.

Visible CTA.

Sticky booking actions.

WhatsApp always available.

Availability always visible.

---

# Information Architecture

Home

Apartments

Apartment Details

Gallery

Amenities

About

Reviews

Location

FAQ

Contact

Booking

Admin Dashboard

---

# Design System

Everything comes from the Design System.

No hardcoded UI.

No duplicate components.

No random spacing.

No random colors.

Everything references tokens.

---

# Component Library

Navbar

Footer

Container

Buttons

Cards

Inputs

Forms

Calendar

Booking Widget

Gallery

Reviews

Feature Cards

Floating Booking Bar

FAQ

Map

Badges

Modals

Toasts

Skeleton Loaders

---

# Backend Modules

Authentication

Users

Roles

Apartments

Bookings

Guests

Gallery

Reviews

Amenities

Messages

Dashboard

Settings

Analytics

Audit Logs

---

# Database Models

User

Role

Apartment

Room

Booking

Guest

Review

GalleryImage

Amenity

Availability

Message

Settings

AuditLog

Relationships must be normalized.

---

# API Principles

RESTful.

Secure.

Predictable.

Validated.

Documented.

Consistent.

---

# Performance Goals

Lazy loading.

Image optimization.

Caching.

Streaming where appropriate.

Minimal JavaScript.

Fast interactions.

---

# Accessibility Goals

WCAG AA.

Keyboard support.

Screen reader compatibility.

Visible focus.

Accessible forms.

Proper semantics.

---

# Security Goals

Authentication.

Authorization.

Rate limiting.

Validation.

Environment variables.

Secure cookies.

HTTPS.

Never expose secrets.

---

# SEO Goals

Metadata.

Structured Data.

Open Graph.

Twitter Cards.

Sitemap.

Robots.txt.

Canonical URLs.

Fast loading.

---

# Current Project Status

Completed

✔ Product Vision

✔ Brand Strategy

✔ Information Architecture

✔ Design Philosophy

✔ Design System Planning

✔ User Flows

✔ Component Planning

✔ Technology Stack

✔ Architecture Planning

In Progress

Frontend implementation

Backend implementation

Database implementation

Component Library

Admin Dashboard

Booking Engine

Not Started

Authentication

Payments

Notifications

Analytics

Testing

Deployment

CI/CD

---

# AI Working Rules

Always read

PROJECT_RULES.md

before making changes.

Always review existing code.

Never create duplicate functionality.

Never create duplicate components.

Never invent architecture.

Reuse existing modules.

Follow SOLID.

Follow DRY.

Follow KISS.

Keep components reusable.

Prefer composition over inheritance.

Explain major decisions before implementing.

Implement incrementally.

Commit after every milestone.

---

# Coding Standards

Strict TypeScript.

Meaningful naming.

Feature-based architecture.

Small reusable functions.

Small reusable components.

No business logic inside UI.

No magic numbers.

No dead code.

No commented-out code.

---

# Decision Log

Decision 001

Project uses monorepo.

Decision 002

Mobile-first.

Decision 003

Next.js + NestJS.

Decision 004

Prisma ORM.

Decision 005

Tailwind CSS.

Decision 006

Design Tokens only.

Decision 007

Hospitality Platform first.

Client second.

Decision 008

Accessibility is mandatory.

Decision 009

Performance is a feature.

Decision 010

Every feature must improve booking conversion.

---

# Long-Term Vision

Project HOSPITALITY should evolve into a platform where any hospitality business can:

Create a website.

Manage rooms.

Manage bookings.

Manage pricing.

Manage guests.

Manage media.

Receive reviews.

Track analytics.

Accept payments.

Integrate WhatsApp.

Integrate Booking.com.

Integrate Airbnb.

Expose APIs.

Support multiple languages.

Support multiple properties.

Support multiple brands.

Become the leading hospitality management platform in Tanzania, then East Africa, then Africa.

Every decision made today should support that future.
