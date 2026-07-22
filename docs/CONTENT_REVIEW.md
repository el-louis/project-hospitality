# Red Masai Owner Content Review

Date: 2026-07-22

`/dashboard/content` is the protected review workspace. The frontend checks the current user for usability; the API independently requires a verified owner/admin session, role authorization and enabled `contentManagement`.

Owners can edit permitted profile fields and their `CONFIRMED`, `ASSUMED_DEMO` or `OWNER_REQUIRED` states; list/create/edit offerings; activate/deactivate, feature and reorder them; set offering confidence; and open the public preview. There is no page builder or hard deletion.

The required review checklist covers official name, email, phone/WhatsApp, address/map, prices, apartment inventory, capacities, inclusions, deposits, payment methods, cleaning/setup charges, cancellation, event/noise/identification rules, check-in/out and transport definition.

The Milestone 4B interface presents these decisions in owner-friendly groups: identity, contact, apartments, prices, policies, experiences, events, creative shoots, media and location. Raw stored confidence values are translated into “Confirmed by owner,” “Demo assumption” and “Owner input needed.” Colour is supported by icons, labels and counts rather than used alone.

Unknown DTO properties are rejected, so flags, roles, secrets and auth settings cannot be edited through content endpoints. Public profile responses exclude field confidence, IDs and timestamps. Public offerings exclude confidence, inactive records and timestamps. Contact values are nullable; the UI shows an owner-confirmation state instead of inventing them. WhatsApp actions require both a persisted number and enabled flag.

## Media review

Milestone 4C adds an owner-friendly media section derived from the tracked placement catalogue. It reports review themes—recognizable people, screen/poster content, food/drinks/setup, public permission and likely replacements—without reading ignored files through a backend endpoint or claiming legal clearance.

The review asks about ownership/control, photographer permission, guest consent, private-versus-public channels, pictured inclusions, apartment/service mapping, original video audio and replacements. Catalogue status is planning metadata only; it is not rights evidence.

Red Masai concept media is stored locally for private owner demonstration and excluded from Git history. Public publication requires owner confirmation, ownership verification, subject-consent review and replacement or approval of any copyrighted screen, poster, broadcast or audio content.
