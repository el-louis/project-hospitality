import { Bath, BedDouble, CheckCircle2, UsersRound } from "lucide-react";
import Link from "next/link";
import { ConceptImage } from "@/components/sections/concept-media";
import { fetchApartment, fetchPublicFeatures } from "@/lib/api";
import { APARTMENT_BOOKING_CURRENCY, formatMoney } from "@/lib/utils";
import type { Apartment } from "@/lib/types";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Apartment details",
  description:
    "Review a persisted Red Masai apartment and begin a real stay request.",
};

export default async function ApartmentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let apartment: Apartment | null = null;
  let errorMessage = "";
  const features = await fetchPublicFeatures().catch(() => null);
  try {
    apartment = await fetchApartment(id);
  } catch {
    errorMessage = "We could not load this apartment at the moment.";
  }

  if (!apartment)
    return (
      <main className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <h1 className="text-4xl font-semibold text-text-primary">
          Apartment unavailable
        </h1>
        <p className="mt-3 text-text-secondary">
          {errorMessage || "This apartment is currently unavailable."}
        </p>
        <Link
          href="/apartments"
          className="mt-6 inline-flex font-bold text-primary"
        >
          Return to all stays →
        </Link>
      </main>
    );

  return (
    <main className="bg-surface px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/apartments"
          className="inline-flex min-h-11 items-center text-sm font-bold text-primary"
        >
          ← All stays
        </Link>
        <div className="mt-4 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <ConceptImage
              mediaKey="stayBedroomPrimary"
              className="aspect-[4/3] rounded-[2rem] shadow-lg"
              sizes="(max-width: 1024px) 100vw, 54vw"
              caption="Visual reference for the Red Masai stay experience. Final room mapping requires owner confirmation."
            />
            <div className="mt-4 grid grid-cols-2 gap-4">
              {[
                "stayBedroomSecondary",
                "stayLivingRoom",
                "stayEntertainment",
                "stayBalcony",
                "stayBathroomBath",
                "stayBathroomShower",
                "stayBathroomToilet",
                "stayExterior",
              ].map((mediaKey, index) => (
                <ConceptImage
                  key={mediaKey}
                  mediaKey={mediaKey as
                    | "stayBedroomSecondary"
                    | "stayLivingRoom"
                    | "stayEntertainment"
                    | "stayBalcony"
                    | "stayBathroomBath"
                    | "stayBathroomShower"
                    | "stayBathroomToilet"
                    | "stayExterior"}
                  className="aspect-square rounded-2xl"
                  sizes="(max-width: 1024px) 50vw, 27vw"
                  caption={index >= 4 ? "Bathroom detail · concept reference" : undefined}
                />
              ))}
            </div>
          </div>
          <article className="py-3">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Private apartment stay
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1 className="text-5xl font-semibold leading-tight text-text-primary">
                {apartment.title}
              </h1>
              <span className="rounded-full bg-[#e5eadf] px-3 py-1 text-xs font-bold text-[#3f5e3f]">
                {apartment.status || "Availability on request"}
              </span>
            </div>
            <p className="mt-3 text-text-secondary">{apartment.location}</p>
            <p className="mt-7 text-3xl font-bold text-text-primary">
              {formatMoney(apartment.pricePerNight, APARTMENT_BOOKING_CURRENCY)}{" "}
              <span className="text-base font-normal text-text-secondary">
                per night
              </span>
            </p>
            <p className="mt-1 text-xs text-text-secondary">
              Current stored apartment rate. No currency conversion has been
              applied.
            </p>
            <p className="mt-8 text-lg leading-8 text-text-secondary">
              {apartment.description ||
                "Apartment description is awaiting owner review. Contact Red Masai for current details."}
            </p>
            <p className="mt-4 rounded-2xl bg-surface-secondary p-4 text-sm leading-6 text-text-secondary">
              The concept imagery presents the wider Red Masai stay experience.
              It is not yet confirmed as a room-by-room record of this specific
              apartment, and pictured items are not amenity promises.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                [BedDouble, "Bedrooms", apartment.bedrooms],
                [Bath, "Bathrooms", apartment.bathrooms],
                [
                  UsersRound,
                  "Maximum guests",
                  apartment.maxGuests ?? "Pending",
                ],
              ].map(([Icon, label, value]) => {
                const Component = Icon as typeof BedDouble;
                return (
                  <div
                    key={String(label)}
                    className="rounded-2xl bg-surface-secondary p-4"
                  >
                    <Component
                      className="text-primary"
                      size={19}
                      aria-hidden="true"
                    />
                    <p className="mt-3 text-xs text-text-secondary">
                      {String(label)}
                    </p>
                    <p className="font-bold text-text-primary">
                      {String(value)}
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-2xl border border-border p-5">
              <h2 className="text-xl font-semibold text-text-primary">
                Before you request
              </h2>
              <ul className="mt-4 space-y-3 text-sm text-text-secondary">
                <li className="flex gap-2">
                  <CheckCircle2 className="shrink-0 text-primary" size={18} />{" "}
                  Dates are checked against live booking and availability
                  records.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="shrink-0 text-primary" size={18} />{" "}
                  Submission creates a pending reference, not payment
                  confirmation.
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="shrink-0 text-primary" size={18} />{" "}
                  Cancellation details require direct confirmation from Red
                  Masai.
                </li>
              </ul>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {features?.onlineBooking ? (
                <Link
                  href={`/booking?apartmentId=${apartment.id}`}
                  className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-bold text-white"
                >
                  Check dates and request
                </Link>
              ) : (
                <span className="rounded-2xl bg-surface-secondary px-5 py-4 text-sm text-text-secondary">
                  Online booking is currently unavailable. Please use the
                  contact path.
                </span>
              )}
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-6 font-bold text-primary"
              >
                Ask a question
              </Link>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
