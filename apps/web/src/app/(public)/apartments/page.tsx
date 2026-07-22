import { fetchApartments } from '@/lib/api';
import { ApartmentCard } from '@/components/sections/apartment-card';
import type { Apartment } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ApartmentsPage() {
  let apartments: Apartment[] = [];

  try {
    apartments = await fetchApartments();
  } catch {
    apartments = [];
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Stay</p>
          <h1 className="mt-3 text-4xl font-semibold text-text-primary sm:text-5xl">Stay at Red Masai</h1>
          <p className="mx-auto mt-4 max-w-2xl text-text-secondary">
            Browse the persisted apartment inventory for couples, individuals, small families, friends, local staycations and visitors to Dar es Salaam.
          </p>
        </div>

        {apartments.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {apartments.map((apartment) => (
              <ApartmentCard key={apartment.id} apartment={apartment} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-surface p-12 text-center shadow-soft">
            <h2 className="text-2xl font-semibold text-text-primary">No apartments available right now</h2>
            <p className="mt-3 text-text-secondary">
              Please contact us for current availability and booking options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
