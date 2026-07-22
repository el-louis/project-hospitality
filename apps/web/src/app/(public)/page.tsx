import {
  ArrowRight,
  CalendarCheck,
  Camera,
  Clapperboard,
  MessageCircle,
  PartyPopper,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { ApartmentCard } from "@/components/sections/apartment-card";
import { MediaPlaceholder } from "@/components/sections/media-placeholder";
import { OfferingCard } from "@/components/sections/offering-card";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import {
  fetchApartments,
  fetchOfferings,
  fetchPublicFeatures,
  fetchRedMasaiProfile,
} from "@/lib/api";

export const dynamic = "force-dynamic";

const intentions = [
  {
    title: "Stay",
    href: "/apartments",
    copy: "Find a private apartment for a visit, staycation or time together.",
    icon: CalendarCheck,
    tone: "bg-[#efe2d4]",
  },
  {
    title: "Celebrate",
    href: "/celebrate",
    copy: "Shape a birthday, engagement, shower or intimate gathering around your moment.",
    icon: PartyPopper,
    tone: "bg-[#f1e1e2]",
  },
  {
    title: "Experience",
    href: "/experiences",
    copy: "Slow down with cinema-style entertainment, garden time or a romantic setting.",
    icon: Clapperboard,
    tone: "bg-[#e6eadf]",
  },
  {
    title: "Create",
    href: "/create",
    copy: "Explore indoor and outdoor space for photography, video and content production.",
    icon: Camera,
    tone: "bg-[#e5e1ea]",
  },
] as const;

export default async function HomePage() {
  const [profile, offerings, apartments, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchOfferings().catch(() => []),
    fetchApartments().catch(() => []),
    fetchPublicFeatures().catch(() => null),
  ]);
  if (!profile || !features?.publicWebsite) return <PublicDataUnavailable />;

  const experiences = offerings.filter(
    (item) => item.category === "EXPERIENCE" && item.featured,
  );
  const celebrations = offerings.filter(
    (item) => item.category === "CELEBRATE",
  );
  const creative = offerings.filter((item) => item.category === "CREATE");

  return (
    <main>
      <section className="relative overflow-hidden bg-surface-secondary px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
              A private place in {profile.region}
            </p>
            <h1 className="text-balance mt-5 max-w-4xl text-5xl font-semibold leading-[1.03] text-text-primary sm:text-6xl lg:text-7xl">
              {profile.tagline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-text-secondary sm:text-xl">
              {profile.shortDescription}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {features.onlineBooking ? (
                <Action href="/booking">Book a stay</Action>
              ) : null}
              <Action href="/experiences" secondary>
                Explore experiences
              </Action>
              <Action href="/celebrate" secondary>
                Plan a celebration
              </Action>
              <Action href="/create" secondary>
                Create at Red Masai
              </Action>
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-text-secondary">
              <ShieldCheck
                className="mt-0.5 shrink-0 text-primary"
                size={18}
                aria-hidden="true"
              />{" "}
              Apartment stays use the real booking flow. Other moments begin
              with an enquiry while details are confirmed.
            </p>
          </div>
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <MediaPlaceholder
              kind="stay"
              label="Red Masai cover image"
              className="aspect-[5/4] rounded-[2rem] shadow-[0_28px_70px_rgba(80,46,43,0.16)]"
            />
            <div className="absolute -bottom-5 left-4 max-w-64 rounded-2xl bg-surface p-4 shadow-lg sm:left-8">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                More than a stay
              </p>
              <p className="mt-1 text-sm text-text-secondary">
                A place to connect, celebrate and create.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Section
        eyebrow="Choose your path"
        title="What would you like to do?"
        intro="Start with the outcome you want. Each path leads to the right information and next step."
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {intentions.map(({ icon: Icon, ...intent }) => (
            <Link
              key={intent.href}
              href={intent.href}
              className="group rounded-3xl border border-border bg-surface p-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
            >
              <span
                className={`grid h-12 w-12 place-items-center rounded-2xl text-primary ${intent.tone}`}
                aria-hidden="true"
              >
                <Icon size={22} />
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-text-primary">
                {intent.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-secondary">
                {intent.copy}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Explore this path <ArrowRight size={16} aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Stay"
        title="A private base for your time in Dar"
        intro="These are the apartments currently stored in Red Masai’s live inventory."
      >
        {apartments.length ? (
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {apartments.slice(0, 3).map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onlineBooking={features.onlineBooking}
              />
            ))}
          </div>
        ) : (
          <EmptyState message="Apartment inventory is temporarily unavailable. Please use the contact path." />
        )}
        <div className="mt-8">
          <Action href="/apartments" secondary>
            See all stays
          </Action>
        </div>
      </Section>

      <Section
        eyebrow="Signature experiences"
        title="Private moments with room to unwind"
        intro="Browse active experience concepts, then enquire so current pricing, capacity and inclusions can be confirmed."
        muted
      >
        <OfferingGrid
          offerings={experiences}
          profile={profile}
          whatsappEnabled={features.whatsappContact}
        />
      </Section>

      <Section
        eyebrow="Celebrate"
        title="Make the setting feel like your own"
        intro="From personal milestones to small group gatherings, begin with the occasion and let the details follow."
      >
        <OfferingGrid
          offerings={celebrations}
          profile={profile}
          whatsappEnabled={features.whatsappContact}
        />
        <div className="mt-8">
          <Action href="/celebrate">Explore celebration ideas</Action>
        </div>
      </Section>

      <Section
        eyebrow="Create"
        title="Give your next idea a private backdrop"
        intro="Explore the concept for photography, video and social content without forcing creative work into the apartment booking flow."
        muted
      >
        <OfferingGrid
          offerings={creative}
          profile={profile}
          whatsappEnabled={features.whatsappContact}
        />
      </Section>

      <Section eyebrow="Why Red Masai" title={profile.valueProposition}>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <p className="text-lg leading-8 text-text-secondary">
            {profile.fullDescription}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "One setting for different moments",
              "Direct communication",
              "A real apartment booking path",
              "Space for stays and creativity",
            ].map((value) => (
              <div
                key={value}
                className="rounded-2xl bg-surface-secondary p-5 text-sm font-semibold text-text-primary"
              >
                {value}
              </div>
            ))}
          </div>
        </div>
      </Section>

      <section className="bg-[#2d2523] px-4 py-16 text-[#f9f1e8] sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-secondary">
              Location
            </p>
            <h2 className="mt-3 text-4xl font-semibold">
              {profile.region}, {profile.city}
            </h2>
            <p className="mt-5 max-w-xl text-[#d9cbc2]">
              The confirmed working area is {profile.region}, {profile.city},{" "}
              {profile.country}. The exact street address and map pin are
              awaiting owner confirmation.
            </p>
            <Link
              href="/location"
              className="mt-7 inline-flex min-h-11 items-center gap-2 font-bold text-secondary"
            >
              Explore the location <ArrowRight size={17} />
            </Link>
          </div>
          <MediaPlaceholder
            kind="location"
            label="Red Masai location exterior"
            className="aspect-[16/8] rounded-3xl text-text-primary"
          />
        </div>
      </section>

      <Section
        eyebrow="Start a conversation"
        title="What are you planning?"
        intro="Stay requests use the live booking flow. Celebrations, experiences and shoots begin with a direct enquiry."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Action href="/contact">
            <MessageCircle size={18} aria-hidden="true" /> Send an enquiry
          </Action>
          {features.onlineBooking ? (
            <Action href="/booking" secondary>
              Book an apartment
            </Action>
          ) : null}
        </div>
      </Section>

      <Section eyebrow="Good to know" title="Frequently asked questions" muted>
        <div className="grid gap-4 lg:grid-cols-2">
          <Faq
            question="What can I book at Red Masai?"
            answer="The concept includes apartment stays, private celebrations, cinema-style and garden experiences, and spaces for photography or video."
          />
          <Faq
            question="Can I book only an apartment stay?"
            answer="Yes. Choose a persisted apartment and use the live booking form. You do not need to add an experience."
          />
          <Faq
            question="How do celebration and experience enquiries work?"
            answer="Choose an offering and contact Red Masai. Capacity, timing, price and inclusions are confirmed directly; no fake reservation is created."
          />
          <Faq
            question="Are the displayed prices final?"
            answer="No. Persisted apartment rates are shown in their current booking currency, while concept offering prices and notes still require owner confirmation."
          />
          <Faq
            question="How will my apartment booking be confirmed?"
            answer="Submitting creates a pending request and real reference. It is not payment or final stay confirmation; Red Masai must confirm the next steps."
          />
          <Faq
            question="Where is Red Masai located?"
            answer={`The working location is ${profile.region}, ${profile.city}, ${profile.country}. Exact directions require owner confirmation.`}
          />
        </div>
      </Section>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  intro,
  children,
  muted = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <section
      className={`${muted ? "bg-surface-secondary" : "bg-surface"} px-4 py-16 sm:px-6 sm:py-20`}
    >
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
          {eyebrow}
        </p>
        <div className="mb-9 mt-3 max-w-3xl">
          <h2 className="text-balance text-4xl font-semibold text-text-primary sm:text-5xl">
            {title}
          </h2>
          {intro ? (
            <p className="mt-4 text-lg text-text-secondary">{intro}</p>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

function Action({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 py-3 text-center font-bold transition-colors ${secondary ? "border border-primary/50 bg-surface text-primary hover:bg-primary/8" : "bg-primary text-white hover:bg-accent"}`}
    >
      {children}
    </Link>
  );
}

function OfferingGrid({
  offerings,
  profile,
  whatsappEnabled,
}: {
  offerings: Awaited<ReturnType<typeof fetchOfferings>>;
  profile: Awaited<ReturnType<typeof fetchRedMasaiProfile>>;
  whatsappEnabled: boolean;
}) {
  return offerings.length ? (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {offerings.map((offering) => (
        <OfferingCard
          key={offering.slug}
          offering={offering}
          profile={profile}
          whatsappEnabled={whatsappEnabled}
        />
      ))}
    </div>
  ) : (
    <EmptyState message="No active offerings are currently published in this category." />
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="rounded-2xl border border-dashed border-border p-8 text-text-secondary">
      {message}
    </p>
  );
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-2xl border border-border bg-surface p-5">
      <summary className="cursor-pointer list-none pr-6 font-bold text-text-primary">
        {question}
        <span
          className="float-right text-primary group-open:rotate-45"
          aria-hidden="true"
        >
          +
        </span>
      </summary>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{answer}</p>
    </details>
  );
}
