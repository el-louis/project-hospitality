# Red Masai Owner Content Review

Date: 2026-07-22

`/dashboard/content` is the protected review workspace. The frontend checks the current user for usability; the API independently requires a verified owner/admin session, role authorization and enabled `contentManagement`.

Owners can edit permitted profile fields and their `CONFIRMED`, `ASSUMED_DEMO` or `OWNER_REQUIRED` states; list/create/edit offerings; activate/deactivate, feature and reorder them; set offering confidence; and open the public preview. There is no page builder or hard deletion.

The required review checklist covers official name, email, phone/WhatsApp, address/map, prices, apartment inventory, capacities, inclusions, deposits, payment methods, cleaning/setup charges, cancellation, event/noise/identification rules, check-in/out and transport definition.

Unknown DTO properties are rejected, so flags, roles, secrets and auth settings cannot be edited through content endpoints. Public profile responses exclude field confidence, IDs and timestamps. Public offerings exclude confidence, inactive records and timestamps. Contact values are nullable; the UI shows an owner-confirmation state instead of inventing them. WhatsApp actions require both a persisted number and enabled flag.
