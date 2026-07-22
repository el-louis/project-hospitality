# Red Masai Visual Concept Preview

Date: 2026-07-22

## Purpose

Milestone 4B turns the functional Red Masai foundation into an owner-demo-ready visual concept. It remains a concept preview rather than approved brand work or a production launch.

## Temporary visual direction

- Warm cream and sand surfaces create a welcoming, private atmosphere.
- Restrained burgundy is the primary action and emphasis colour; clay, olive and muted lilac support the four customer intentions.
- Georgia/Cambria are system-safe expressive display faces; Avenir/Segoe/system sans-serif is used for readable body copy.
- Rounded editorial cards, generous spacing and structured media placeholders make photography easy to replace later.
- All colours, typography, imagery and decorative motifs require owner/brand approval.

No remote font, external photo, Instagram asset or third-party media is bundled. The concept uses CSS artwork, Lucide interface icons and labelled media placeholders.

## Public routes and paths

- `/`: concept notice, hero, four intent paths, persisted stays, offerings, values, location, contact and FAQ.
- `/apartments`, `/apartments/[id]`, `/booking`, `/booking/confirmation`: real apartment booking path with USD stored-rate presentation and explicit non-payment wording.
- `/celebrate`, `/experiences`, `/create`: purposeful enquiry paths backed by active offerings.
- `/about`, `/location`, `/contact`: editable working identity and safe missing-data states.
- `/dashboard/content`: protected, owner-friendly content review.

The responsive system is mobile-first from 320px, uses a disclosure navigation below the desktop breakpoint, maintains 44px-or-larger primary tap targets, stacks cards/forms, and prevents document-level horizontal overflow.

## Accessibility and performance

Pages use one primary heading, semantic landmarks, labelled fields, keyboard-visible focus, live status/error regions, accessible menu state and text alongside colour-coded review states. Decorative shapes are hidden. Reduced-motion preferences disable transitions and smooth scrolling. Media slots reserve aspect ratio to avoid layout shifts; public pages remain primarily server-rendered while only navigation, forms and protected editing require client state.

## Feature behavior

The preview notice follows `conceptPreview`. Booking calls to action and the booking unavailable state follow `onlineBooking`. WhatsApp links require `whatsappContact` plus a persisted number; otherwise links lead to `/contact`. Guest account/history sections follow their public flags. Backend guards remain authoritative.

## Production gaps

Owner approval is still required for brand identity, content, contacts, exact location, prices, policies, capacities, inclusions and every photograph. Payments, event reservations, automated messaging and production SEO publication remain deferred.
