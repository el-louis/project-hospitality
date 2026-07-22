import Link from "next/link";
import { ApartmentCard } from "@/components/sections/apartment-card";
import { OfferingCard } from "@/components/sections/offering-card";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchApartments, fetchOfferings, fetchPublicFeatures, fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";

const intentions = [
  { title: "Stay", href: "/apartments", copy: "Studios, one-bedroom options and full-apartment stays." },
  { title: "Celebrate", href: "/celebrate", copy: "Private moments, gatherings and intimate events." },
  { title: "Experience", href: "/experiences", copy: "Cinema-style entertainment, garden time and private leisure." },
  { title: "Create", href: "/create", copy: "Indoor and outdoor spaces for photography and video." },
] as const;

export default async function HomePage() {
  const [profile, offerings, apartments, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchOfferings().catch(() => []),
    fetchApartments().catch(() => []),
    fetchPublicFeatures().catch(() => null),
  ]);
  if (!profile || !features?.publicWebsite) return <PublicDataUnavailable />;

  const experiences = offerings.filter((item) => item.category === "EXPERIENCE" && item.featured);
  const celebrations = offerings.filter((item) => item.category === "CELEBRATE");
  const creative = offerings.filter((item) => item.category === "CREATE");
  const whatsappNumber = features.whatsappContact ? profile.whatsapp?.replace(/\D/g, "") : null;

  return (
    <main>
      <section className="bg-surface-secondary px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{profile.region}, {profile.city}</p>
          <h1 className="mt-5 max-w-4xl text-4xl font-semibold text-text-primary sm:text-6xl">{profile.tagline}</h1>
          <p className="mt-6 max-w-3xl text-lg text-text-secondary sm:text-xl">{profile.shortDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {features.onlineBooking ? <Action href="/booking">Book a stay</Action> : null}
            <Action href="/celebrate" secondary>Plan a celebration</Action>
            <Action href="/experiences" secondary>Explore experiences</Action>
            <Action href="/create" secondary>Book a shoot</Action>
            {whatsappNumber ? <Action href={`https://wa.me/${whatsappNumber}`} secondary>Chat on WhatsApp</Action> : null}
          </div>
        </div>
      </section>

      <Section eyebrow="Choose your path" title="What would you like to do?">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {intentions.map((intent) => (
            <Link key={intent.href} href={intent.href} className="rounded-2xl border border-border bg-surface p-6 shadow-soft transition hover:border-primary">
              <h3 className="text-xl font-semibold text-text-primary">{intent.title}</h3>
              <p className="mt-3 text-sm text-text-secondary">{intent.copy}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section eyebrow="Stay" title="Choose a persisted apartment">
        {apartments.length ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {apartments.slice(0, 3).map((apartment) => <ApartmentCard key={apartment.id} apartment={apartment} />)}
          </div>
        ) : <EmptyState message="Apartment inventory is awaiting availability from the booking API." />}
      </Section>

      <Section eyebrow="Experience" title="Signature private experiences" muted>
        <OfferingGrid offerings={experiences} profile={profile} />
      </Section>

      <Section eyebrow="Celebrate" title="A private setting for your moments">
        <OfferingGrid offerings={celebrations} profile={profile} />
        <div className="mt-8"><Action href="/celebrate">Explore celebration possibilities</Action></div>
      </Section>

      <Section eyebrow="Create" title="Bring your creative idea to Red Masai" muted>
        <OfferingGrid offerings={creative} profile={profile} />
      </Section>

      <Section eyebrow="Why Red Masai" title={profile.valueProposition}>
        <p className="max-w-3xl text-lg text-text-secondary">{profile.fullDescription}</p>
      </Section>

      <Section eyebrow="Location" title={`${profile.region}, ${profile.city}`} muted>
        <p className="max-w-2xl text-text-secondary">The exact address and map pin are awaiting owner confirmation. The current working location is {profile.region}, {profile.city}, {profile.country}.</p>
        <div className="mt-6"><Action href="/location">View location details</Action></div>
      </Section>

      <Section eyebrow="Contact" title="Plan your Red Masai moment">
        <p className="max-w-2xl text-text-secondary">Choose the path that fits your visit. Stay requests use the live apartment booking flow; celebrations, experiences and shoots begin with an enquiry.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Action href="/contact">Send an enquiry</Action>
          {whatsappNumber ? <Action href={`https://wa.me/${whatsappNumber}`} secondary>Open WhatsApp</Action> : null}
        </div>
      </Section>

      <Section eyebrow="Questions" title="Frequently asked questions" muted>
        <div className="grid gap-4 md:grid-cols-2">
          <Faq question="Can I book an apartment online?" answer={features.onlineBooking ? "Yes. Select a persisted apartment, check its recorded availability and submit a booking request." : "Online booking is currently unavailable. Please use the contact path."} />
          <Faq question="Can I reserve an event or shoot online?" answer="Not yet. These concept offerings use an enquiry or WhatsApp path while requirements are confirmed." />
          <Faq question="Are the displayed packages and prices final?" answer="No. This is a concept preview and owner confirmation is still required for some prices, capacities, policies and inclusions." />
          <Faq question="Where is Red Masai?" answer={`The working location is ${profile.region}, ${profile.city}. The exact address and map pin require owner confirmation.`} />
        </div>
      </Section>
    </main>
  );
}

function Section({ eyebrow, title, children, muted = false }: { eyebrow: string; title: string; children: React.ReactNode; muted?: boolean }) {
  return <section className={`${muted ? "bg-surface-secondary" : "bg-surface"} px-4 py-16 sm:px-6`}><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p><h2 className="mt-3 mb-8 text-3xl font-semibold text-text-primary sm:text-4xl">{title}</h2>{children}</div></section>;
}

function Action({ href, children, secondary = false }: { href: string; children: React.ReactNode; secondary?: boolean }) {
  return <Link href={href} className={`inline-flex rounded-full px-6 py-3 font-semibold transition-colors ${secondary ? "border border-primary text-primary hover:bg-primary/10" : "bg-primary text-white hover:bg-accent"}`}>{children}</Link>;
}

function OfferingGrid({ offerings, profile }: { offerings: Awaited<ReturnType<typeof fetchOfferings>>; profile: Awaited<ReturnType<typeof fetchRedMasaiProfile>> }) {
  return offerings.length ? <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{offerings.map((offering) => <OfferingCard key={offering.slug} offering={offering} profile={profile} />)}</div> : <EmptyState message="No active offerings are available in this category." />;
}

function EmptyState({ message }: { message: string }) {
  return <p className="rounded-2xl border border-dashed border-border p-8 text-text-secondary">{message}</p>;
}

function Faq({ question, answer }: { question: string; answer: string }) {
  return <details className="rounded-2xl border border-border bg-surface p-5"><summary className="cursor-pointer font-semibold text-text-primary">{question}</summary><p className="mt-3 text-sm text-text-secondary">{answer}</p></details>;
}
