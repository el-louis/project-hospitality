import Link from "next/link";
import type { PublicOffering, RedMasaiProfile } from "@/lib/types";

export function OfferingCard({ offering, profile }: { offering: PublicOffering; profile?: RedMasaiProfile | null }) {
  const contactHref = getOfferingContactHref(offering, profile);
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6 shadow-soft">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{offering.category.toLowerCase()}</p>
      <h3 className="mt-3 text-2xl font-semibold text-text-primary">{offering.title}</h3>
      <p className="mt-3 flex-1 text-text-secondary">{offering.shortSummary}</p>
      {offering.startingPrice != null ? (
        <p className="mt-5 font-semibold text-text-primary">
          From {offering.currency} {offering.startingPrice.toLocaleString()}
        </p>
      ) : null}
      {offering.pricingNote ? <p className="mt-2 text-sm text-text-secondary">{offering.pricingNote}</p> : null}
      <Link href={contactHref} className="mt-6 inline-flex font-semibold text-primary hover:text-accent">
        Enquire about this experience →
      </Link>
    </article>
  );
}

function getOfferingContactHref(offering: PublicOffering, profile?: RedMasaiProfile | null): string {
  const number = profile?.whatsapp?.replace(/\D/g, "");
  if (offering.whatsappAction && number) {
    const message = encodeURIComponent(`Hello Red Masai, I would like to enquire about ${offering.title}.`);
    return `https://wa.me/${number}?text=${message}`;
  }
  return `/contact?offering=${encodeURIComponent(offering.slug)}`;
}
