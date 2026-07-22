# Red Masai Functional Concept Preview

Date: 2026-07-22

## Purpose and customer paths

Milestone 4A is a **Functional Concept Preview**, not an official production website. It presents Red Masai as a private serviced-apartment and lifestyle-experience venue through four paths:

- **Stay:** persisted apartments and the real booking/availability engine.
- **Celebrate:** editable offerings followed by enquiry or prepared WhatsApp contact.
- **Experience:** cinema-style, garden and private-leisure offerings followed by enquiry or WhatsApp.
- **Create:** photography/video/content offerings followed by enquiry or WhatsApp.

Non-stay offerings never produce a fake reservation or enter the apartment booking engine. Their future reservation domain is deferred until capacity, time-slot, resource, policy and payment requirements are confirmed.

## Persisted content

`red_masai_profile` is a singleton enforced by `id = 1`. It stores editable identity, positioning, contact, location, social, operating-time, currency, booking/policy and preview-notice content. `field_confidence` stores protected per-field review state.

`offerings` stores non-apartment products with category (`STAY`, `CELEBRATE`, `EXPERIENCE`, `CREATE`), slug, copy, optional price/capacity/duration/inclusions, booking method, WhatsApp action, image reference, active/featured/order controls and confidence. Public serialization hides inactive records and internal confidence.

Existing apartments remain the source of stay inventory; no duplicates are seeded.

## Seed and confidence

The deterministic seed creates Private Cinema Experience and Garden Picnic as `ASSUMED_DEMO`, and Romantic Garden Dinner, Private Celebrations and Creative Shoots as `OWNER_REQUIRED`. The picnic carries demonstration prices of TZS 100,000 standalone and approximately TZS 30,000 for apartment guests. Other uncertain prices remain null or explicitly noted for review.

Confirmed working information: Mbezi Beach/Dar es Salaam, apartment stays, events/celebrations, cinema-style entertainment, garden experiences, photography/video use and phone/WhatsApp communication.

Assumed demonstration information: working positioning/copy and any demonstration price, capacity, time, deposit, cancellation, inclusion, food/drink/snack/bicycle or transport statement.

Owner confirmation is required for official name, email, phone/WhatsApp, exact address/map, current prices, inventory, capacities, check-in/out, payment methods, deposits, cleaning/setup charges, cancellation, event/noise/identification rules, transport definition and package inclusions.

## Migration and evolution

`RedMasaiConceptContent1723000000000` creates only the profile, offerings, supporting enums and index. Stable seed IDs plus `ON CONFLICT (id) DO NOTHING` make seeding deterministic. Apartments, bookings, availability, users and sessions are untouched. `synchronize` remains disabled and this milestone does not apply the migration remotely.

Rollback drops both milestone-owned tables and permanently deletes edited content; it requires backup and review.

Future multi-business work can create Business, copy the singleton into the first business, convert offerings to BusinessOffering, then scope apartments and operations with business foreign keys. No BusinessMembership or tenant switching exists now.

## Deferred

Final brand design, colors, typography, logo, photography, production copy approval, payments/mobile money, event reservations, automated WhatsApp/email, full operations dashboard, multi-business, remote flags and advanced analytics are deferred.
