import { AuthCard } from "@/components/sections/auth-card";
import { BookingForm } from "@/components/sections/booking-form";
import { BookingHistory } from "@/components/sections/booking-history";
import { ProfileCard } from "@/components/sections/profile-card";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchPublicFeatures } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Book a stay",
  description:
    "Check persisted apartment availability and submit a pending Red Masai stay request.",
};
export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ apartmentId?: string | string[] }>;
}) {
  const requestedApartmentId = (await searchParams).apartmentId;
  const apartmentId = Array.isArray(requestedApartmentId)
    ? requestedApartmentId[0]
    : requestedApartmentId;
  const features = await fetchPublicFeatures().catch(() => null);
  if (!features) return <PublicDataUnavailable />;
  if (!features.onlineBooking)
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Stay booking
        </p>
        <h1 className="mt-4 text-4xl font-semibold text-text-primary">
          Online booking is currently unavailable
        </h1>
        <p className="mt-4 text-text-secondary">
          No booking can be submitted while this feature is disabled. Please use
          the contact page to ask about a stay.
        </p>
      </main>
    );
  return (
    <main className="min-h-screen bg-surface px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Stay booking
          </p>
          <h1 className="mt-3 text-5xl font-semibold text-text-primary sm:text-6xl">
            Request a Red Masai apartment stay
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Choose a persisted apartment and dates. The booking engine checks
            availability, calculates the stored USD rate and returns a real
            pending reference.
          </p>
          <p className="mt-3 rounded-xl bg-surface-secondary px-4 py-3 text-sm font-semibold text-text-secondary">
            No payment is taken on this website. A submitted request is not
            final stay confirmation.
          </p>
        </div>
        <BookingForm initialApartmentId={apartmentId} />
        {features.guestAccounts ? (
          <section className="mt-16 border-t border-border pt-14">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
              Optional
            </p>
            <h2 className="mb-3 mt-2 text-3xl font-semibold text-text-primary">
              Guest account and history
            </h2>
            <p className="mb-7 max-w-2xl text-text-secondary">
              Accounts help returning guests view their own requests. You can
              still submit a stay request without creating one.
            </p>
            <div className="grid gap-6 lg:grid-cols-3">
              <AuthCard />
              <ProfileCard />
              {features.guestBookingHistory ? <BookingHistory /> : null}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
