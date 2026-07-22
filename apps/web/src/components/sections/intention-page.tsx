import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ConceptImage, ConceptVideo } from "./concept-media";
import { OfferingCard } from "./offering-card";
import type { PublicOffering, RedMasaiProfile } from "@/lib/types";

export function IntentionPage({
  eyebrow,
  title,
  introduction,
  examples,
  offerings,
  profile,
  whatsappEnabled = false,
}: {
  eyebrow: "Celebrate" | "Experience" | "Create";
  title: string;
  introduction: string;
  examples: readonly string[];
  offerings: PublicOffering[];
  profile: RedMasaiProfile;
  whatsappEnabled?: boolean;
}) {
  const heroKey =
    eyebrow === "Celebrate"
      ? "experienceGardenWide"
      : eyebrow === "Create"
        ? "createEventPreparationPoster"
        : "experienceCinema";
  return (
    <main>
      <section className="bg-surface-secondary px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
              {eyebrow} at Red Masai
            </p>
            <h1 className="text-balance mt-4 max-w-4xl text-5xl font-semibold leading-tight text-text-primary sm:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-text-secondary">
              {introduction}
            </p>
            <Link
              href="#options"
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-white"
            >
              Explore {eyebrow.toLowerCase()} options <ArrowRight size={17} />
            </Link>
          </div>
          <ConceptImage
            mediaKey={heroKey}
            className="aspect-[4/3] rounded-[2rem] shadow-lg"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </div>
      </section>
      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
                Possibilities
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-text-primary">
                Start with your idea
              </h2>
              <p className="mt-4 text-text-secondary">
                These examples describe the concept direction. Availability,
                capacity and detailed requirements are confirmed during enquiry.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2">
              {examples.map((example) => (
                <li
                  key={example}
                  className="flex items-center gap-3 rounded-2xl bg-surface-secondary p-4 text-sm font-semibold text-text-primary"
                >
                  <CheckCircle2
                    className="shrink-0 text-primary"
                    size={18}
                    aria-hidden="true"
                  />
                  {example}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      {eyebrow === "Experience" ? <ExperienceStory /> : null}
      {eyebrow === "Celebrate" ? <CelebrateStory /> : null}
      {eyebrow === "Create" ? <CreateStory /> : null}
      <section
        id="options"
        className="bg-surface-secondary px-4 py-16 sm:px-6 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Active concepts
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-text-primary">
            Choose an option to discuss
          </h2>
          <p className="mt-4 max-w-2xl text-text-secondary">
            No reservation is created here. Your enquiry helps Red Masai confirm
            the current details before you make plans.
          </p>
          <div className="mt-9 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offerings.map((offering) => (
              <OfferingCard
                key={offering.slug}
                offering={offering}
                profile={profile}
                whatsappEnabled={whatsappEnabled}
              />
            ))}
          </div>
          {!offerings.length ? (
            <p className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-8 text-text-secondary">
              No active offerings are currently published for this path.
            </p>
          ) : null}
          <div className="mt-10">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full border border-primary px-6 font-bold text-primary"
            >
              Tell us what you are planning
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function ExperienceStory() {
  return (
    <section className="bg-[#292321] px-4 py-16 text-[#fff8ef] sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">
          Shared time, different moods
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold sm:text-5xl">
          Cinema nights, garden pauses and room to play
        </h2>
        <div className="mt-9 grid gap-5 lg:grid-cols-2">
          <StoryCard
            mediaKey="experienceCinema"
            title="Private cinema atmosphere"
            copy="A visual reference for a private screening setting. Movie availability and licensing are not implied."
          />
          <StoryCard
            mediaKey="experienceGardenWide"
            title="Garden time"
            copy="A garden concept shaped around conversation and unhurried time. Food, drinks, lighting and setup require confirmation."
          />
          <StoryCard
            mediaKey="experienceRomanticBath"
            title="Romantic relaxation"
            copy="A visual concept of private relaxation possibilities. Exact arrangements and inclusions require owner confirmation."
          />
          <div className="grid grid-cols-2 gap-5">
            <ConceptImage
              mediaKey="experienceGamesCheckers"
              className="aspect-[4/5] rounded-3xl"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <ConceptImage
              mediaKey="experienceGamesPool"
              className="aspect-[4/5] rounded-3xl"
              sizes="(max-width: 1024px) 50vw, 25vw"
            />
            <p className="col-span-2 text-sm leading-6 text-[#d9cbc2]">
              Games and lounge scenes show leisure possibilities, not a
              confirmed amenity list.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CelebrateStory() {
  return (
    <section className="bg-[#f3e4de] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Gather in your own way
        </p>
        <h2 className="mt-3 max-w-3xl text-4xl font-semibold text-text-primary sm:text-5xl">
          A warm setting for personal milestones
        </h2>
        <div className="mt-9 grid gap-5 md:grid-cols-3">
          <StoryCard
            mediaKey="celebrateGardenDinner"
            title="Garden dinner concept"
            copy="An intimate dinner reference; catering, drinks, decoration and setup are not included unless confirmed."
            light
          />
          <StoryCard
            mediaKey="experienceGardenDetail"
            title="Picnic detail"
            copy="An example atmosphere for birthdays, showers, anniversaries or friends gathering together."
            light
          />
          <StoryCard
            mediaKey="celebratePicnicGroup"
            title="Private group moments"
            copy="Shown only in private demo mode. Publication permission for recognizable guests is still required."
            light
          />
        </div>
      </div>
    </section>
  );
}

function CreateStory() {
  return (
    <section className="bg-[#e8e3dc] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.7fr_1.3fr]">
        <ConceptVideo
          mediaKey="createEventPreparationVideo"
          posterKey="createEventPreparationPoster"
          className="mx-auto w-full max-w-sm rounded-[2rem] shadow-lg"
          caption="Private demo footage · muted by default"
        />
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            From preparation to the finished moment
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-text-primary sm:text-5xl">
            A private setting for lifestyle, food, event and social-media content
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            The video is a concept reference for food preparation, event setup,
            venue transformation and lifestyle creation. It does not promise
            cameras, lighting, microphones, production staff, editing, studio
            equipment or full production services.
          </p>
          <p className="mt-4 text-sm leading-6 text-text-secondary">
            Audio rights are unverified. Playback begins only when a visitor
            chooses it, and the video remains muted by default.
          </p>
        </div>
      </div>
    </section>
  );
}

function StoryCard({
  mediaKey,
  title,
  copy,
  light = false,
}: {
  mediaKey:
    | "experienceCinema"
    | "experienceGardenWide"
    | "experienceRomanticBath"
    | "celebrateGardenDinner"
    | "experienceGardenDetail"
    | "celebratePicnicGroup";
  title: string;
  copy: string;
  light?: boolean;
}) {
  return (
    <article className={`overflow-hidden rounded-3xl ${light ? "bg-surface" : "bg-white/6"}`}>
      <ConceptImage
        mediaKey={mediaKey}
        className="aspect-[4/3]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <div className="p-5">
        <h3 className={`text-2xl font-semibold ${light ? "text-text-primary" : "text-white"}`}>
          {title}
        </h3>
        <p className={`mt-2 text-sm leading-6 ${light ? "text-text-secondary" : "text-[#d9cbc2]"}`}>
          {copy}
        </p>
      </div>
    </article>
  );
}
