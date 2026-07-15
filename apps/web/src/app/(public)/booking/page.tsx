import { BookingForm } from "@/components/sections/booking-form";

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ apartmentId?: string | string[] }>;
}) {
  const requestedApartmentId = (await searchParams).apartmentId;
  const apartmentId = Array.isArray(requestedApartmentId)
    ? requestedApartmentId[0]
    : requestedApartmentId;

  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Booking
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-text-primary sm:text-5xl">
            Reserve a stay with confidence
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Share a few details and our team will help you plan your stay.
          </p>
        </div>
        <BookingForm initialApartmentId={apartmentId} />
      </div>
    </main>
  );
}
