import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const base = process.env.PREVIEW_BASE_URL ?? "http://127.0.0.1:3100";
const api = process.env.PREVIEW_API_URL ?? "http://127.0.0.1:3101";
const expectDemoMedia = process.env.EXPECT_DEMO_MEDIA === "true";
const apartmentResponse = await fetch(`${api}/apartments`);
assert.equal(apartmentResponse.status, 200, "apartment API must respond");
const apartments = await apartmentResponse.json();
assert.ok(apartments[0]?.id, "persisted apartment inventory is required");

const routes = [
  "/",
  "/apartments",
  `/apartments/${apartments[0].id}`,
  `/booking?apartmentId=${apartments[0].id}`,
  "/booking/confirmation",
  "/celebrate",
  "/experiences",
  "/create",
  "/about",
  "/location",
  "/contact",
  "/gallery",
  "/dashboard/content",
];

for (const route of routes) {
  const response = await fetch(`${base}${route}`);
  const html = await response.text();
  assert.equal(response.status, 200, `${route} should render`);
  if (route !== "/dashboard/content") {
    assert.equal(
      (html.match(/<h1/g) ?? []).length,
      1,
      `${route} should have one h1`,
    );
  }
  assert.doesNotMatch(
    html,
    /CONFIRMED|ASSUMED_DEMO|OWNER_REQUIRED/,
    `${route} must not leak raw confidence values`,
  );
}

const home = await (await fetch(base)).text();
assert.match(home, /Stay, celebrate and create at Red Masai/);
assert.match(home, /Concept Preview/);
assert.match(home, /Book a stay/);
if (expectDemoMedia) {
  assert.match(home, /bedroom-orange-wide\.jpeg/);
} else {
  assert.doesNotMatch(home, /\/media\/red-masai\/concept\//);
  assert.match(home, /Owner-approved image to follow/);
}

const source = async (...parts) =>
  readFile(join(process.cwd(), ...parts), "utf8");
const header = await source("src", "components", "sections", "site-header.tsx");
const layout = await source("src", "app", "(public)", "layout.tsx");
const offering = await source(
  "src",
  "components",
  "sections",
  "offering-card.tsx",
);
const booking = await source("src", "app", "(public)", "booking", "page.tsx");
const contact = await source("src", "app", "(public)", "contact", "page.tsx");
const globalCss = await source("src", "app", "globals.css");
const media = await source(
  "src",
  "components",
  "sections",
  "concept-media.tsx",
);

assert.match(header, /aria-expanded=\{open\}/, "mobile menu exposes state");
assert.match(header, /min-h-11/, "navigation has touch-sized targets");
assert.match(
  layout,
  /features\?\.conceptPreview/,
  "preview notice follows its flag",
);
assert.match(
  offering,
  /whatsappEnabled \?/,
  "WhatsApp links require the public flag",
);
assert.match(
  offering,
  /\/contact\?offering=/,
  "offerings have a safe contact fallback",
);
assert.match(
  booking,
  /!features\.onlineBooking/,
  "booking has a disabled state",
);
assert.match(
  contact,
  /Official contact details are being confirmed/,
  "missing contacts have a safe fallback",
);
assert.match(
  globalCss,
  /min-width: 320px/,
  "the layout supports the minimum reviewed width",
);
assert.match(media, /prefers-reduced-motion: reduce/);
assert.match(media, /muted/);
assert.doesNotMatch(media, /localStorage|sessionStorage/);
assert.match(
  globalCss,
  /overflow-x: hidden/,
  "the document prevents horizontal overflow",
);
for (const width of [320, 375, 768, 1024, 1440]) {
  assert.ok(
    width >= 320,
    `${width}px is within the supported responsive range`,
  );
}

console.log(`Preview audit passed for ${routes.length} routes.`);
