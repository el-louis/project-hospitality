import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { MediaPlaceholder } from "./media-placeholder";
import { formatMoney } from "@/lib/utils";
import type { PublicOffering, RedMasaiProfile } from "@/lib/types";

export function OfferingCard({
  offering,
  profile,
  whatsappEnabled = false,
}: {
  offering: PublicOffering;
  profile?: RedMasaiProfile | null;
  whatsappEnabled?: boolean;
}) {
  const contactHref = getOfferingContactHref(
    offering,
    profile,
    whatsappEnabled,
  );
  const usesWhatsApp = contactHref.startsWith("https://wa.me/");
  const kind = offering.slug.includes("cinema")
    ? "cinema"
    : offering.category === "CELEBRATE"
      ? "celebrate"
      : offering.category === "CREATE"
        ? "create"
        : "experience";
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <MediaPlaceholder
        kind={kind}
        label={`${offering.title} image`}
        className="aspect-[16/9]"
      />
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {offering.category.toLowerCase()}
        </p>
        <h3 className="mt-3 text-2xl font-semibold leading-tight text-text-primary">
          {offering.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-text-secondary">
          {offering.shortSummary}
        </p>
        {offering.startingPrice != null ? (
          <p className="mt-5 text-lg font-bold text-text-primary">
            From {formatMoney(offering.startingPrice, offering.currency)}
          </p>
        ) : (
          <p className="mt-5 text-sm font-semibold text-primary">
            Price confirmed during enquiry
          </p>
        )}
        {offering.pricingNote ? (
          <p className="mt-2 text-xs leading-5 text-text-secondary">
            {offering.pricingNote}
          </p>
        ) : null}
        <Link
          href={contactHref}
          className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-primary hover:text-accent"
        >
          {usesWhatsApp ? <MessageCircle size={17} aria-hidden="true" /> : null}
          {usesWhatsApp
            ? "Enquire on WhatsApp"
            : "Enquire about this option"}{" "}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export function getOfferingContactHref(
  offering: PublicOffering,
  profile?: RedMasaiProfile | null,
  whatsappEnabled = false,
): string {
  const number = whatsappEnabled ? profile?.whatsapp?.replace(/\D/g, "") : null;
  if (offering.whatsappAction && number) {
    const message = encodeURIComponent(
      `Hello Red Masai, I would like to enquire about ${offering.title}.`,
    );
    return `https://wa.me/${number}?text=${message}`;
  }
  return `/contact?offering=${encodeURIComponent(offering.slug)}`;
}
