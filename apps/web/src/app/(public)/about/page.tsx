import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function AboutPage() {
  const profile = await fetchRedMasaiProfile().catch(() => null);
  if (!profile) return <PublicDataUnavailable />;
  return <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Our story</p><h1 className="mt-4 text-4xl font-semibold text-text-primary sm:text-5xl">{profile.valueProposition}</h1><p className="mt-8 text-lg leading-8 text-text-secondary">{profile.fullDescription}</p><div className="mt-10 rounded-2xl bg-surface-secondary p-6"><h2 className="text-xl font-semibold text-text-primary">Working positioning</h2><p className="mt-3 text-text-secondary">{profile.tagline}</p></div></main>;
}
