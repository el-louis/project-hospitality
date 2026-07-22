import { ConceptImage, ConceptVideo } from "@/components/sections/concept-media";
import type { RedMasaiMediaKey } from "@/lib/red-masai-media";

export const metadata = {
  title: "Gallery Preview",
  description:
    "A private concept gallery for the Red Masai stay, garden, cinema and creative story.",
};

const categories: readonly {
  title: string;
  description: string;
  items: readonly { key: RedMasaiMediaKey; caption: string }[];
}[] = [
  {
    title: "Stay",
    description: "Bedroom and living-space visual references.",
    items: [
      { key: "stayBedroomPrimary", caption: "Warm bedroom reference" },
      { key: "stayBedroomSecondary", caption: "Evening bedroom reference" },
      { key: "stayLivingRoom", caption: "Living space" },
    ],
  },
  {
    title: "Garden",
    description: "Garden atmosphere; setup and pictured items require confirmation.",
    items: [
      { key: "experienceGardenWide", caption: "Garden picnic atmosphere" },
      { key: "experienceGardenDetail", caption: "Gathering detail" },
    ],
  },
  {
    title: "Cinema",
    description: "Cinema-style atmosphere without implying licensed movie supply.",
    items: [{ key: "experienceCinema", caption: "Private cinema setting" }],
  },
  {
    title: "Relax",
    description: "Concept references; exact arrangements are confirmed separately.",
    items: [
      { key: "experienceRomanticBath", caption: "Private relaxation concept" },
      { key: "stayBalcony", caption: "A quiet balcony moment" },
    ],
  },
  {
    title: "Gather",
    description: "Private-demo gathering imagery; public permission is not implied.",
    items: [
      { key: "celebrateGardenDinner", caption: "Garden dinner concept" },
      { key: "celebratePicnicGroup", caption: "Friends gathering" },
    ],
  },
  {
    title: "Play",
    description: "Leisure possibilities, not a confirmed amenity list.",
    items: [
      { key: "experienceGamesCheckers", caption: "Checkers" },
      { key: "experienceGamesPool", caption: "Pool table" },
      { key: "stayEntertainment", caption: "Lounge atmosphere" },
    ],
  },
  {
    title: "Property",
    description: "Exterior and detailed stay references.",
    items: [
      { key: "stayExterior", caption: "Exterior at night" },
      { key: "stayBathroomBath", caption: "Bathroom and bathtub" },
      { key: "stayBathroomShower", caption: "Shower detail" },
      { key: "stayBathroomToilet", caption: "Bathroom detail" },
    ],
  },
];

export default function GalleryPage() {
  return (
    <main className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Gallery preview
        </p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold text-text-primary sm:text-6xl">
          Stay, gather, unwind and create
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
          This private concept gallery presents possible Red Masai moments.
          Room mapping, services, setup and all pictured inclusions require
          owner confirmation.
        </p>
        <nav aria-label="Gallery categories" className="mt-8 flex flex-wrap gap-2">
          {categories.map((category) => (
            <a
              key={category.title}
              href={`#gallery-${category.title.toLowerCase()}`}
              className="inline-flex min-h-11 items-center rounded-full border border-primary/40 px-4 text-sm font-bold text-primary"
            >
              {category.title}
            </a>
          ))}
          <a
            href="#gallery-create"
            className="inline-flex min-h-11 items-center rounded-full border border-primary/40 px-4 text-sm font-bold text-primary"
          >
            Create
          </a>
        </nav>
        <div className="mt-14 space-y-16">
          {categories.map((category) => (
            <section
              key={category.title}
              id={`gallery-${category.title.toLowerCase()}`}
              aria-labelledby={`heading-${category.title.toLowerCase()}`}
              className="scroll-mt-28"
            >
              <h2
                id={`heading-${category.title.toLowerCase()}`}
                className="text-4xl font-semibold text-text-primary"
              >
                {category.title}
              </h2>
              <p className="mt-2 max-w-2xl text-text-secondary">
                {category.description}
              </p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <ConceptImage
                    key={item.key}
                    mediaKey={item.key}
                    className="aspect-[4/3] rounded-3xl"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    caption={item.caption}
                  />
                ))}
              </div>
            </section>
          ))}
          <section id="gallery-create" className="scroll-mt-28">
            <h2 className="text-4xl font-semibold text-text-primary">Create</h2>
            <p className="mt-2 max-w-2xl text-text-secondary">
              Event preparation and venue transformation for lifestyle, food
              and social-media content—not a professional studio-equipment claim.
            </p>
            <ConceptVideo
              mediaKey="createEventPreparationVideo"
              posterKey="createEventPreparationPoster"
              className="mt-6 w-full max-w-sm rounded-3xl"
              caption="Private demo video · muted by default"
            />
          </section>
        </div>
      </div>
    </main>
  );
}
