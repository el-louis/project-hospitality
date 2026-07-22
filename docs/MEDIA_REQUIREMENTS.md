# Red Masai Owner-Approved Media Requirements

Date: 2026-07-22

No Instagram or third-party media has been copied into the repository. Current media areas are neutral CSS placeholders with stable aspect ratios.

## Required assets

| Asset | Suggested minimum | Notes |
| --- | --- | --- |
| Logo | SVG plus transparent PNG | Confirm official name and safe-space rules. |
| Homepage cover | 2000×1600 landscape | Show the overall private setting without unsupported claims. |
| Studio apartment | 1600×1200, 6–10 images | Bedroom, bathroom, living area and only verified amenities. |
| One-bedroom apartment | 1600×1200, 6–10 images | Required if this inventory is active. |
| Full apartment | 1600×1200, 8–12 images | Show actual spaces and sleeping configuration. |
| Cinema | 1600×1000 | Confirm equipment, seating and inclusions shown. |
| Garden/picnic | 1600×1000 | Include empty garden and approved setup examples. |
| Celebrations/events | 1600×1000 | Obtain consent from identifiable guests. |
| Creative shoots | 1600×1000 | Confirm creator/model usage rights. |
| Location exterior | 1600×1000 | Avoid publishing an unapproved exact address. |
| Team or host | 1200×1500 portrait | Optional; obtain explicit consent. |

## Delivery and rights checklist

- Owner confirms copyright ownership or a valid publication licence.
- Identifiable people have model/guest consent, including minors where applicable.
- Remove sensitive documents, number plates and private information.
- Supply descriptive captions/alt-text context and a preferred focal point.
- Provide web-ready JPEG/WebP originals without social-platform watermarks.
- Record approval date, approver and allowed channels.

Final optimization, crops, art direction and media storage are deferred until approved assets are supplied.

## Private owner-demo media boundary

Milestone 4C can use a local pack through a typed placement catalogue without committing it. `.gitignore` excludes `apps/web/public/media/red-masai/concept/`; source files contain browser-relative catalogue paths only and never base64 data or tracked derivatives. Only literal `NEXT_PUBLIC_RED_MASAI_DEMO_MEDIA=true` enables it. Public and reproducible builds must leave the value false.

The resolver preserves dimensions and fallbacks if the entire folder or one asset is unavailable. Development-time Next.js optimization is allowed, but no permanent derivative or transcoded video may be tracked. Recognizable guests, screens/posters/broadcasts, brands, food, drinks, decoration, bath styling, games and audio remain review items rather than service or rights claims.

Red Masai concept media is stored locally for private owner demonstration and excluded from Git history. Public publication requires owner confirmation, ownership verification, subject-consent review and replacement or approval of any copyrighted screen, poster, broadcast or audio content.

Ignored files require a separate backup: retain the original ZIP, a private cloud copy and a local laptop or phone copy. Codespaces and GitHub are not media archives. After approval, create a reviewed publishing plan that records rights, allowed channels, consent, apartment/service mapping and replacements before moving approved files into a production media system.
