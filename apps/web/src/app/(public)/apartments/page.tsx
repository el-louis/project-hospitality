import { fetchApartments, fetchPublicFeatures } from "@/lib/api";
import { ApartmentCard } from "@/components/sections/apartment-card";
import type { Apartment } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Stay",
  description:
    "Browse the current persisted Red Masai apartment inventory and begin a stay request.",
};

export default async function ApartmentsPage() {
  let apartments: Apartment[] = [];
  const features = await fetchPublicFeatures().catch(() => null);

  try {
    apartments = await fetchApartments();
  } catch {
    apartments = [];
  }

  return (
    <main className="min-h-screen bg-surface">
      <section className="bg-surface-secondary px-4 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Stay
            </p>
            <h1 className="mt-3 text-5xl font-semibold text-text-primary sm:text-6xl">
              Stay at Red Masai
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-text-secondary">
              Browse the persisted apartment inventory for couples, individuals,
              small families, friends, local staycations and visitors to Dar es
              Salaam.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9">
            <h2 className="text-3xl font-semibold text-text-primary">
              Current apartment inventory
            </h2>
            <p className="mt-3 max-w-2xl text-text-secondary">
              Rates below use the booking system’s stored USD currency.
              Availability is checked again when a request is submitted.
            </p>
          </div>
          {apartments.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {apartments.map((apartment) => (
                <ApartmentCard
                  key={apartment.id}
                  apartment={apartment}
                  onlineBooking={Boolean(features?.onlineBooking)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-primary/30 bg-surface p-12 text-center shadow-soft">
              <h2 className="text-2xl font-semibold text-text-primary">
                No apartments available right now
              </h2>
              <p className="mt-3 text-text-secondary">
                Please contact us for current availability and booking options.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
