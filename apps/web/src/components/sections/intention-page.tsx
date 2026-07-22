import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { MediaPlaceholder } from "./media-placeholder";
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
  const kind =
    eyebrow === "Celebrate"
      ? "celebrate"
      : eyebrow === "Create"
        ? "create"
        : "experience";
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
          <MediaPlaceholder
            kind={kind}
            label={`${eyebrow} at Red Masai`}
            className="aspect-[4/3] rounded-[2rem] shadow-lg"
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
