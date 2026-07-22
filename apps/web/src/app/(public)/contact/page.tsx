import Link from "next/link";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchPublicFeatures, fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ offering?: string | string[] }> }) {
  const [profile, features] = await Promise.all([fetchRedMasaiProfile().catch(() => null), fetchPublicFeatures().catch(() => null)]);
  if (!profile || !features) return <PublicDataUnavailable />;
  const requested = (await searchParams).offering;
  const offering = Array.isArray(requested) ? requested[0] : requested;
  const whatsapp = features.whatsappContact ? profile.whatsapp?.replace(/\D/g, "") : null;
  const message = encodeURIComponent(`Hello Red Masai, I would like to enquire${offering ? ` about ${offering.replaceAll("-", " ")}` : ""}.`);
  return <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Contact</p><h1 className="mt-4 text-4xl font-semibold text-text-primary">Tell Red Masai what you are planning</h1><p className="mt-5 max-w-2xl text-lg text-text-secondary">For celebrations, experiences and shoots, begin with an enquiry so current availability, capacity, price and inclusions can be confirmed.</p><div className="mt-10 grid gap-6 md:grid-cols-2">{whatsapp ? <ContactCard title="WhatsApp" value={profile.whatsapp ?? ""} href={`https://wa.me/${whatsapp}?text=${message}`} action="Open a prepared WhatsApp message" /> : <UnavailableCard title="WhatsApp number" />}{profile.phone ? <ContactCard title="Phone" value={profile.phone} href={`tel:${profile.phone}`} action="Call Red Masai" /> : <UnavailableCard title="Official phone number" />}{profile.email ? <ContactCard title="Email" value={profile.email} href={`mailto:${profile.email}?subject=${encodeURIComponent("Red Masai enquiry")}`} action="Send an email" /> : <UnavailableCard title="Official email" />}</div></main>;
}

function ContactCard({ title, value, href, action }: { title: string; value: string; href: string; action: string }) {
  return <section className="rounded-2xl border border-border bg-surface p-6"><h2 className="text-xl font-semibold text-text-primary">{title}</h2><p className="mt-2 text-text-secondary">{value}</p><Link href={href} className="mt-5 inline-flex font-semibold text-primary hover:text-accent">{action} →</Link></section>;
}
function UnavailableCard({ title }: { title: string }) {
  return <section className="rounded-2xl border border-dashed border-border bg-surface-secondary p-6"><h2 className="text-xl font-semibold text-text-primary">{title}</h2><p className="mt-2 text-sm text-text-secondary">Owner confirmation is required before this contact method can be published.</p></section>;
}
