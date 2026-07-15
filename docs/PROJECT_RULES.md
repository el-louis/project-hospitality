# PROJECT_RULES.md

> The Constitution of Project HOSPITALITY

---

# Vision

Project HOSPITALITY is not a website.

It is a reusable hospitality platform that can power apartments, hotels, resorts, lodges, guest houses, and vacation rentals.

The first implementation is **Red Masai Apartments** in Tanzania.

Every architectural decision must support future reuse across multiple hospitality businesses.

---

# Mission

Build a world-class hospitality platform that feels:

- Premium
- Modern
- Calm
- Trustworthy
- Welcoming
- Authentically Tanzanian
- Mobile First

The goal is not to impress developers.

The goal is to create trust that converts visitors into guests.

---

# Core Principles

## 1. Product First

Always solve user problems before writing code.

Every feature must answer:

> Does this make booking easier?

If not,

don't build it.

---

## 2. Simplicity Wins

Never add complexity unless it creates measurable value.

Prefer

Simple

Readable

Maintainable

Predictable

---

## 3. Mobile First

Assume every guest visits using a phone.

Design desktop second.

Every screen must work beautifully on:

320px

375px

768px

1024px

1440px

---

## 4. Performance First

Performance is a feature.

Target:

First Load

<2 seconds

Lighthouse

Performance >90

Accessibility >95

SEO >95

Best Practices >95

---

## 5. Accessibility

Every user matters.

Meet WCAG AA.

Support:

Keyboard navigation

Screen readers

Visible focus

Proper semantics

Color contrast

Accessible forms

---

## 6. Reusability

Never duplicate code.

If something is reused twice,

make it reusable.

Use shared:

Components

Hooks

Utilities

Types

Constants

Services

---

## 7. Design System Only

Never invent UI while coding.

Everything must come from the Design System.

Colors

Typography

Spacing

Radius

Motion

Icons

Buttons

Cards

Inputs

Everything.

---

# Design Philosophy

Luxury through simplicity.

Not decoration.

Not animations.

Not gradients.

The interface should feel:

Calm

Confident

Elegant

Minimal

Human

Whitespace is part of the design.

---

# Brand Personality

Refined

Welcoming

Authentically Tanzanian

Modern

Trustworthy

Peaceful

Inclusive

Every page should reflect these values.

---

# Tech Stack

Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- React Hook Form
- Zod

Backend

- NestJS
- Prisma ORM
- PostgreSQL

Deployment

- Vercel
- Railway
- Neon PostgreSQL
- Cloudinary

Package Manager

- pnpm

Monorepo

- Turborepo

---

# Folder Structure

project-hospitality/

apps/

packages/

docs/

.github/

scripts/

Never create folders outside this structure without good reason.

---

# Coding Standards

Always use:

TypeScript strict mode.

Meaningful variable names.

Small reusable functions.

Feature-based architecture.

Dependency injection.

Composition over inheritance.

Avoid:

Magic numbers

Deep nesting

Long functions

Anonymous business logic

Duplicated code

---

# SOLID

Every feature must follow SOLID.

Single Responsibility

Open Closed

Liskov

Interface Segregation

Dependency Inversion

---

# DRY

Don't Repeat Yourself.

If code repeats,

extract it.

---

# KISS

Keep It Simple.

If two solutions exist,

choose the simpler one.

---

# Clean Code

Functions should do one thing.

Files should have one responsibility.

Components should remain small.

Avoid files longer than 300 lines unless justified.

---

# Component Rules

Every component must have:

Purpose

Props

Variants

States

Accessibility

Documentation

Never create duplicate components.

---

# Styling Rules

Only use design tokens.

Never hardcode:

Colors

Spacing

Radius

Typography

Shadows

Z-index

Transitions

Everything must reference tokens.

---

# Motion Rules

Animation supports usability.

Never distract.

Use:

Fade

Slide

Scale

Opacity

Transform

Avoid:

Flashy effects

Long animations

Unnecessary motion

---

# User Experience Rules

The homepage should answer:

What is this?

Can I trust it?

Can I book?

The user should understand the product within

10 seconds.

The user should begin booking within

60 seconds.

---

# Booking Philosophy

Reduce friction.

Minimum steps.

Minimum typing.

Always show:

Book Now

Availability

Price

Contact

Never hide critical booking information.

---

# API Rules

RESTful.

Predictable.

Versioned.

Validated.

Secure.

Every endpoint must:

Validate input.

Return proper status codes.

Handle errors gracefully.

---

# Database Rules

Normalize where appropriate.

Avoid duplicate data.

Use proper foreign keys.

Use indexes where needed.

Never expose internal IDs unnecessarily.

---

# Security

Never trust client input.

Always validate.

Always sanitize.

Use:

Authentication

Authorization

Rate limiting

Input validation

Environment variables

Secure cookies

HTTPS

---

# Error Handling

Every API must return:

Success

Validation error

Authentication error

Authorization error

Server error

Never expose internal stack traces.

---

# Logging

Log:

Errors

Warnings

Authentication events

Bookings

Admin actions

Never log passwords or secrets.

---

# Testing

Every important feature should have:

Unit tests

Integration tests

Manual QA

Critical flows must always be tested.

---

# Git Workflow

Branch naming

feature/

fix/

refactor/

docs/

Commit Messages

feat:

fix:

refactor:

docs:

style:

test:

build:

Example

feat: implement booking calendar

---

# Pull Requests

Every PR should include:

Purpose

Screenshots

Testing

Checklist

Never merge broken code.

---

# Documentation

Every major feature must update:

Architecture

API

Database

Components

Roadmap

README

Documentation is part of the product.

---

# Definition of Done

A task is complete only if:

✓ Responsive

✓ Accessible

✓ Tested

✓ Documented

✓ Typed

✓ Reusable

✓ Uses Design System

✓ Optimized

✓ Reviewed

---

# Copilot Instructions

Before writing code:

Understand the task.

Read the Design System.

Read Architecture.

Read API specification.

Read Database documentation.

Reuse existing components.

Never invent architecture.

Never duplicate functionality.

Explain major decisions before implementing.

Work incrementally.

---

# Final Principle

Do not build a website.

Build a hospitality platform that can become the standard for premium hospitality businesses across Tanzania and eventually Africa.

Every decision should make the platform more reusable, more maintainable, and more delightful for both guests and property owners.

Build for the next 10 years, not just for the next deployment.
