import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

const source = (...parts) => readFile(join(process.cwd(), ...parts), "utf8");
const catalogue = await source("src", "lib", "red-masai-media.ts");
const component = await source(
  "src",
  "components",
  "sections",
  "concept-media.tsx",
);
const home = await source("src", "app", "(public)", "page.tsx");
const gallery = await source("src", "app", "(public)", "gallery", "page.tsx");
const create = await source("src", "app", "(public)", "create", "page.tsx");
const intention = await source(
  "src",
  "components",
  "sections",
  "intention-page.tsx",
);
const review = await source(
  "src",
  "components",
  "content",
  "content-review.tsx",
);

assert.match(
  catalogue,
  /process\.env\.NEXT_PUBLIC_RED_MASAI_DEMO_MEDIA === "true"/,
  "only literal true enables private media",
);
assert.match(
  catalogue,
  /return value === "true"/,
  "strict parser defaults missing and malformed values to false",
);

const keys = [...catalogue.matchAll(/^  ([a-z][A-Za-z]+): (?:image\(|\{)/gm)].map(
  (match) => match[1],
);
assert.ok(keys.length >= 22, "catalogue contains the complete placement set");
assert.equal(new Set(keys).size, keys.length, "placement keys are unique");

assert.match(component, /onError=\{\(\) => setUnavailable\(true\)\}/);
assert.match(component, /enabled && !unavailable/);
assert.match(component, /muted/);
assert.match(component, /playsInline/);
assert.match(component, /controlsList="nodownload noplaybackrate"/);
assert.match(component, /prefers-reduced-motion: reduce/);
assert.match(component, /posterProbe\.onerror = \(\) => setUnavailable\(true\)/);
assert.doesNotMatch(component, /autoPlay/);

assert.match(home, /mediaKey="homeHeroStay"/);
assert.match(home, /mediaKey="homeHeroGarden"/);
assert.match(home, /mediaKey="homeHeroCinema"/);
assert.doesNotMatch(home, /stayBathroom(?:Bath|Shower|Toilet)/);

const promotionalBlock = catalogue.match(
  /export const promotionalMediaKeys:[\s\S]*?\];/,
)?.[0];
assert.ok(promotionalBlock, "promotional key boundary exists");
assert.doesNotMatch(promotionalBlock, /Bathroom|Toilet|Shower/);

for (const category of [
  "Stay",
  "Garden",
  "Cinema",
  "Relax",
  "Gather",
  "Play",
  "Create",
  "Property",
]) {
  assert.match(gallery, new RegExp(category), `gallery includes ${category}`);
}
assert.doesNotMatch(gallery, /\.jpeg|\.jpg|\.mp4/);

const createCopy = `${create}\n${intention}`;
for (const unsupportedClaim of [
  "provides professional cameras",
  "provides professional lighting",
  "provides microphones",
  "provides production staff",
  "provides editing",
  "fully equipped professional studio",
]) {
  assert.doesNotMatch(createCopy.toLowerCase(), new RegExp(unsupportedClaim));
}
assert.match(review, /Did recognizable guests agree to publication\?/);
assert.match(review, /May the video’s original audio be used\?/);
assert.match(review, /does not\s+claim legal clearance/);

console.log(`Media audit passed for ${keys.length} unique placement records.`);
