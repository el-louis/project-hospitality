import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function LocationPage() {
  const profile = await fetchRedMasaiProfile().catch(() => null);
  if (!profile) return <PublicDataUnavailable />;
  const hasExactLocation = profile.address && profile.latitude != null && profile.longitude != null;
  return <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Location</p><h1 className="mt-4 text-4xl font-semibold text-text-primary">{profile.region}, {profile.city}</h1><p className="mt-5 max-w-2xl text-lg text-text-secondary">Red Masai is located in {profile.region}, {profile.city}, {profile.country}.</p><div className="mt-10 rounded-2xl border border-border bg-surface-secondary p-8">{hasExactLocation ? <><p className="font-semibold text-text-primary">{profile.address}</p><p className="mt-2 text-sm text-text-secondary">Coordinates: {profile.latitude}, {profile.longitude}</p></> : <><h2 className="text-xl font-semibold text-text-primary">Exact directions require confirmation</h2><p className="mt-3 text-text-secondary">The official street address and map pin have not yet been approved for this concept preview. Contact Red Masai before travelling.</p></>}</div></main>;
}
