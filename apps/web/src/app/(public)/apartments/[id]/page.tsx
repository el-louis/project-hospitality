// apps/web/src/app/apartments/[id]/page.tsx
import Link from "next/link";
import { fetchApartment } from "@/lib/api";
import type { Apartment } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ApartmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let apartment: Apartment | null = null;
  let errorMessage = "";

  try {
    apartment = await fetchApartment(id);
  } catch {
    errorMessage = "We could not load this apartment at the moment.";
  }

  return (
    <main className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {apartment ? (
          <div className="overflow-hidden rounded-2xl bg-surface shadow-soft">
            <img
              src={apartment.imageUrl || "/apartment-placeholder.jpg"}
              alt={apartment.title}
              className="h-96 w-full object-cover"
            />
            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-3xl font-semibold text-text-primary">
                  {apartment.title}
                </h1>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {apartment.status || "Available"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <span className="text-2xl font-semibold text-primary">
                  ${apartment.pricePerNight}/night
                </span>
                <span className="text-text-secondary">
                  {apartment.location}
                </span>
              </div>
              <p className="mt-6 text-text-secondary">
                {apartment.description ||
                  "A welcoming stay with thoughtful amenities."}
              </p>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div>
                  <p className="text-sm text-text-secondary">Bedrooms</p>
                  <p className="mt-1 font-semibold text-text-primary">
                    {apartment.bedrooms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Bathrooms</p>
                  <p className="mt-1 font-semibold text-text-primary">
                    {apartment.bathrooms}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Max guests</p>
                  <p className="mt-1 font-semibold text-text-primary">
                    {apartment.maxGuests ?? 2}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={`/booking?apartmentId=${apartment.id}`}
                  className="rounded-full bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent"
                >
                  Book now
                </Link>
                <Link
                  href="/contact"
                  className="rounded-full border border-primary px-6 py-3 font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  Contact host
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-primary/30 bg-surface p-12 text-center shadow-soft">
            <h1 className="text-3xl font-semibold text-text-primary">
              Apartment unavailable
            </h1>
            <p className="mt-3 text-text-secondary">
              {errorMessage || "This apartment is currently unavailable."}
            </p>
            <Link
              href="/apartments"
              className="mt-6 inline-flex text-sm font-semibold text-primary hover:text-accent"
            >
              Return to apartments →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
