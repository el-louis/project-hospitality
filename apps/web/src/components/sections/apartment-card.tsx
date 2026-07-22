import { ArrowRight, BedDouble, UsersRound } from "lucide-react";
import Link from "next/link";
import { ConceptImage } from "./concept-media";
import { APARTMENT_BOOKING_CURRENCY, formatMoney } from "@/lib/utils";
import type { Apartment } from "@/lib/types";

export function ApartmentCard({
  apartment,
  availability,
  onlineBooking = true,
}: {
  apartment: Apartment;
  availability?: string;
  onlineBooking?: boolean;
}) {
  const cardAvailability =
    availability || apartment.status || "Availability on request";
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <ConceptImage
        mediaKey="stayBedroomPrimary"
        className="aspect-[16/10]"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        caption="Visual reference for the Red Masai stay experience. Final room mapping requires owner confirmation."
      />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-text-primary">
              {apartment.title}
            </h3>
            <p className="mt-1 text-sm text-text-secondary">
              {apartment.location}
            </p>
          </div>
          <span className="rounded-full bg-[#e5eadf] px-3 py-1 text-xs font-bold text-[#3f5e3f]">
            {cardAvailability}
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble size={17} aria-hidden="true" />
            {apartment.bedrooms}{" "}
            {apartment.bedrooms === 1 ? "bedroom" : "bedrooms"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <UsersRound size={17} aria-hidden="true" />
            {apartment.maxGuests
              ? `Up to ${apartment.maxGuests}`
              : "Capacity pending"}
          </span>
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <p className="text-xs uppercase tracking-[0.16em] text-text-secondary">
            Current stored rate
          </p>
          <p className="mt-1 text-xl font-bold text-text-primary">
            {formatMoney(apartment.pricePerNight, APARTMENT_BOOKING_CURRENCY)}{" "}
            <span className="text-sm font-normal text-text-secondary">
              / night
            </span>
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-4">
          <Link
            href={`/apartments/${apartment.id}`}
            className="inline-flex min-h-11 items-center gap-2 font-bold text-primary"
          >
            View the apartment <ArrowRight size={16} />
          </Link>
          {onlineBooking ? (
            <Link
              href={`/booking?apartmentId=${apartment.id}`}
              className="inline-flex min-h-11 items-center font-bold text-text-secondary hover:text-primary"
            >
              Check dates
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
