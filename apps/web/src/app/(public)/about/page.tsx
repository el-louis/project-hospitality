import { Camera, Flower2, Home, PartyPopper } from "lucide-react";
import { MediaPlaceholder } from "@/components/sections/media-placeholder";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Our Story",
  description:
    "The working story behind Red Masai’s stay, celebration, experience and creative concept in Mbezi Beach.",
};

export default async function AboutPage() {
  const profile = await fetchRedMasaiProfile().catch(() => null);
  if (!profile) return <PublicDataUnavailable />;
  const paths = [
    [
      Home,
      "Stay",
      "A private apartment base for visits, staycations and time together.",
    ],
    [
      PartyPopper,
      "Celebrate",
      "A setting for milestones, gatherings and personal moments.",
    ],
    [
      Flower2,
      "Experience",
      "Garden, cinema-style and leisure concepts designed around shared time.",
    ],
    [
      Camera,
      "Create",
      "Indoor and outdoor possibilities for photography and video.",
    ],
  ] as const;
  return (
    <main>
      <section className="bg-surface-secondary px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Our working story
            </p>
            <h1 className="text-balance mt-4 text-5xl font-semibold leading-tight text-text-primary sm:text-6xl">
              {profile.valueProposition}
            </h1>
            <p className="mt-7 text-lg leading-8 text-text-secondary">
              {profile.fullDescription}
            </p>
            <p className="mt-5 text-sm text-text-secondary">
              This wording is part of the concept preview and remains open to
              owner correction.
            </p>
          </div>
          <MediaPlaceholder
            kind="stay"
            label="Red Masai story and host image"
            className="aspect-[4/3] rounded-[2rem] shadow-lg"
          />
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            One setting, four paths
          </p>
          <h2 className="mt-3 text-4xl font-semibold text-text-primary">
            Designed around what guests want to do
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paths.map(([Icon, title, copy]) => (
              <article
                key={title}
                className="rounded-3xl border border-border p-6"
              >
                <Icon className="text-primary" aria-hidden="true" />
                <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  {copy}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-3xl bg-[#2d2523] p-7 text-[#f9f1e8] sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">
              Working positioning
            </p>
            <p className="mt-3 font-display text-3xl">{profile.tagline}</p>
            <p className="mt-3 text-sm text-[#d9cbc2]">
              The final brand story, voice and imagery require owner approval.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
