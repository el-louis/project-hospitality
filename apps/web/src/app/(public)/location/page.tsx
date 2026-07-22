import Link from "next/link";
import { MediaPlaceholder } from "@/components/sections/media-placeholder";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Location",
  description:
    "Red Masai’s confirmed working location in Mbezi Beach, Dar es Salaam, Tanzania.",
};

export default async function LocationPage() {
  const profile = await fetchRedMasaiProfile().catch(() => null);
  if (!profile) return <PublicDataUnavailable />;
  const hasExactLocation =
    profile.address && profile.latitude != null && profile.longitude != null;
  return (
    <main className="bg-surface px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Location
          </p>
          <h1 className="text-balance mt-4 text-5xl font-semibold text-text-primary sm:text-6xl">
            Mbezi Beach, Dar es Salaam
          </h1>
          <p className="mt-5 text-lg leading-8 text-text-secondary">
            The confirmed working location is {profile.region}, {profile.city},{" "}
            {profile.country}. This preview does not claim an exact street, map
            pin, beachfront position or travel distance.
          </p>
          <div className="mt-8 rounded-2xl border border-border bg-surface-secondary p-6">
            {hasExactLocation ? (
              <>
                <h2 className="text-xl font-semibold text-text-primary">
                  Approved directions
                </h2>
                <p className="mt-3 text-text-secondary">{profile.address}</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-text-primary">
                  Exact directions are still being confirmed
                </h2>
                <p className="mt-3 text-sm leading-6 text-text-secondary">
                  The official street address and map pin have not been approved
                  for publication. Contact Red Masai before travelling.
                </p>
              </>
            )}
          </div>
          <Link
            href="/contact"
            className="mt-7 inline-flex min-h-12 items-center rounded-full bg-primary px-6 font-bold text-white"
          >
            Ask for current directions
          </Link>
        </div>
        <MediaPlaceholder
          kind="location"
          label="Map and Red Masai exterior"
          className="aspect-square rounded-[2rem] shadow-lg lg:aspect-[5/4]"
        />
      </div>
    </main>
  );
}
