import { Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchPublicFeatures, fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Contact",
  description:
    "Start a concept-safe enquiry about a Red Masai stay, celebration, experience or creative shoot.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ offering?: string | string[] }>;
}) {
  const [profile, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchPublicFeatures().catch(() => null),
  ]);
  if (!profile || !features) return <PublicDataUnavailable />;
  const requested = (await searchParams).offering;
  const offering = Array.isArray(requested) ? requested[0] : requested;
  const whatsapp = features.whatsappContact
    ? profile.whatsapp?.replace(/\D/g, "")
    : null;
  const message = encodeURIComponent(
    `Hello Red Masai, I would like to enquire${offering ? ` about ${offering.replaceAll("-", " ")}` : ""}.`,
  );
  const hasContact = Boolean(whatsapp || profile.phone || profile.email);
  return (
    <main>
      <section className="bg-surface-secondary px-4 py-14 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Contact
          </p>
          <h1 className="text-balance mt-4 max-w-4xl text-5xl font-semibold text-text-primary sm:text-6xl">
            Tell Red Masai what you are planning
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-secondary">
            For celebrations, experiences and shoots, begin with an enquiry so
            availability, capacity, price and inclusions can be confirmed.
          </p>
          {offering ? (
            <p className="mt-5 inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
              Enquiry topic: {offering.replaceAll("-", " ")}
            </p>
          ) : null}
        </div>
      </section>
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {whatsapp ? (
              <ContactCard
                icon={MessageCircle}
                title="WhatsApp"
                value={profile.whatsapp ?? ""}
                href={`https://wa.me/${whatsapp}?text=${message}`}
                action="Open a prepared message"
              />
            ) : (
              <UnavailableCard icon={MessageCircle} title="WhatsApp number" />
            )}
            {profile.phone ? (
              <ContactCard
                icon={Phone}
                title="Phone"
                value={profile.phone}
                href={`tel:${profile.phone}`}
                action="Call Red Masai"
              />
            ) : (
              <UnavailableCard icon={Phone} title="Official phone number" />
            )}
            {profile.email ? (
              <ContactCard
                icon={Mail}
                title="Email"
                value={profile.email}
                href={`mailto:${profile.email}?subject=${encodeURIComponent("Red Masai enquiry")}`}
                action="Send an email"
              />
            ) : (
              <UnavailableCard icon={Mail} title="Official email" />
            )}
          </div>
          {!hasContact ? (
            <div role="status" className="mt-8 rounded-3xl bg-[#f1e1e2] p-6">
              <h2 className="text-2xl font-semibold text-text-primary">
                Official contact details are being confirmed
              </h2>
              <p className="mt-3 max-w-2xl text-text-secondary">
                No contact address has been invented for this preview. During
                the owner demonstration, these fields can be reviewed and added
                through the protected content area.
              </p>
            </div>
          ) : null}
          <div className="mt-10 rounded-3xl border border-border p-6">
            <h2 className="text-2xl font-semibold">What to include</h2>
            <p className="mt-3 text-text-secondary">
              Share the date, number of people, type of stay or moment, and any
              setup or accessibility needs. Red Masai can then confirm what is
              currently possible.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon: Icon,
  title,
  value,
  href,
  action,
}: {
  icon: typeof Mail;
  title: string;
  value: string;
  href: string;
  action: string;
}) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-6 shadow-sm">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 break-words text-text-secondary">{value}</p>
      <Link
        href={href}
        className="mt-5 inline-flex min-h-11 items-center font-bold text-primary hover:text-accent"
      >
        {action} →
      </Link>
    </section>
  );
}
function UnavailableCard({
  icon: Icon,
  title,
}: {
  icon: typeof Mail;
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-dashed border-border bg-surface-secondary p-6">
      <span className="grid h-11 w-11 place-items-center rounded-full bg-surface text-text-secondary">
        <Icon size={20} aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Owner confirmation is required before this contact method can be
        published.
      </p>
    </section>
  );
}
