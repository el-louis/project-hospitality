import Link from 'next/link';
import type { Apartment } from '@/lib/types';

type ApartmentCardProps = {
  apartment: Apartment;
  image?: string;
  availability?: string;
};

export function ApartmentCard({ apartment, image, availability }: ApartmentCardProps) {
  const cardAvailability = availability || apartment.status || 'Available';

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-soft">
      <div className="flex h-40 items-center justify-center bg-surface-secondary px-6 text-center text-sm text-text-secondary" role="img" aria-label={`Image placeholder for ${apartment.title}`}>
        {image || apartment.imageUrl ? "Apartment image reference available" : "Approved photography pending"}
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{apartment.title}</h3>
            <p className="mt-1 text-sm text-text-secondary">{apartment.location}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {cardAvailability}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-text-secondary">
          <span>{apartment.bedrooms} bedrooms</span>
          <span>{apartment.bathrooms} bathrooms</span>
          <span>{apartment.maxGuests ? `${apartment.maxGuests} guests` : "Capacity pending"}</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">From</p>
            <p className="text-xl font-semibold text-text-primary">${apartment.pricePerNight}/night</p>
          </div>
          <p className="text-right text-xs text-text-secondary">Stored apartment rate</p>
        </div>

        <Link
          href={`/apartments/${apartment.id}`}
          className="mt-6 inline-flex items-center text-sm font-semibold text-primary transition-colors hover:text-accent"
        >
          View details →
        </Link>
      </div>
    </article>
  );
}
