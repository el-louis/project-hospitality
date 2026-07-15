import Link from 'next/link';
import type { Apartment } from '@/lib/types';

type ApartmentCardProps = {
  apartment: Apartment;
  image?: string;
  availability?: string;
  rating?: number;
};

export function ApartmentCard({ apartment, image, availability, rating }: ApartmentCardProps) {
  const apartmentImage = image || apartment.imageUrl || '/apartment-placeholder.jpg';
  const cardAvailability = availability || apartment.status || 'Available';
  const cardRating = rating ?? 4.9;

  return (
    <article className="overflow-hidden rounded-2xl border border-primary/10 bg-surface shadow-soft">
      <img src={apartmentImage} alt={apartment.title} className="h-56 w-full object-cover" />
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
          <span>{apartment.maxGuests ?? 2} guests</span>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-text-secondary">From</p>
            <p className="text-xl font-semibold text-text-primary">${apartment.pricePerNight}/night</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-secondary">Rating</p>
            <p className="text-sm font-medium text-text-primary">★ {cardRating.toFixed(1)}</p>
          </div>
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