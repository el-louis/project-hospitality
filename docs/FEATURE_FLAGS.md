# Typed Feature Flags

Date: 2026-07-22

The NestJS `FeaturesModule` owns a closed `FeatureName` union, environment-key map, defaults, service, `@RequireFeature()` decorator and backend guard. Only case-insensitive `true` and `false` are accepted. Missing values use documented defaults; malformed configured values fail closed.

Public `GET /features/public` exposes only:

| Flag | Default | Purpose |
| --- | --- | --- |
| `conceptPreview` | on | Render persisted concept notice. |
| `publicWebsite` | on | Public profile/offering reads. |
| `onlineBooking` | on | Real apartment booking creation. |
| `guestAccounts` | on | Public account registration. |
| `guestBookingHistory` | on | Personal authenticated history. |
| `whatsappContact` | on | Confirmed WhatsApp actions. |

Internal and future flags:

| Flag | Default | Purpose |
| --- | --- | --- |
| `staffDashboard` | on | Protected dashboard summary. |
| `bookingManagement` | on | Protected staff booking management. |
| `availabilityManagement` | on | Protected manual availability changes. |
| `contentManagement` | on | Protected profile and offering review. |
| `payments` | off | Deferred payment processing. |
| `mobileMoney` | off | Deferred mobile-money processing. |
| `multiBusiness` | off | Deferred multi-business data model. |
| `businessOnboarding` | off | Deferred business onboarding. |
| `businessSwitching` | off | Deferred tenant switching. |
| `restaurantModule` | off | Deferred restaurant operations. |
| `recreationModule` | off | Deferred recreation operations. |
| `eventVenueModule` | off | Deferred event reservation module. |
| `reviews` | off | Deferred public reviews. |
| `advancedAnalytics` | off | Deferred analytics. |
| `customDomains` | off | Deferred domain management. |
| `staffInvitations` | off | Deferred staff invitation workflow. |

Backend guards are the capability boundary; frontend hiding/unavailable states are only usability controls. Flags never grant identity or roles. Protected handlers still require the existing authorization and role guards. The public response never includes internal flags, environment keys or environment values.

Examples are in `apps/api/.env.example`. Deployed environments should explicitly configure launch flags; future capabilities must remain false.
