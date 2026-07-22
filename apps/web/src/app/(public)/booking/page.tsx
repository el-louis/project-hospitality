import { AuthCard } from "@/components/sections/auth-card";
import { BookingForm } from "@/components/sections/booking-form";
import { BookingHistory } from "@/components/sections/booking-history";
import { ProfileCard } from "@/components/sections/profile-card";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchPublicFeatures } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function BookingPage({ searchParams }: { searchParams: Promise<{ apartmentId?: string | string[] }> }) {
  const requestedApartmentId = (await searchParams).apartmentId;
  const apartmentId = Array.isArray(requestedApartmentId) ? requestedApartmentId[0] : requestedApartmentId;
  const features = await fetchPublicFeatures().catch(() => null);
  if (!features) return <PublicDataUnavailable />;
  if (!features.onlineBooking) return <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6"><h1 className="text-4xl font-semibold text-text-primary">Online booking is currently unavailable</h1><p className="mt-4 text-text-secondary">Please use the contact page while this capability is disabled.</p></main>;
  return <main className="min-h-screen bg-background px-4 py-16 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl"><div className="mb-10 max-w-2xl"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Stay booking</p><h1 className="mt-3 text-4xl font-semibold text-text-primary sm:text-5xl">Request a Red Masai apartment stay</h1><p className="mt-4 text-lg text-text-secondary">Select persisted apartment inventory and dates. The API will calculate the stored rate and return a real booking reference.</p></div><BookingForm initialApartmentId={apartmentId} />{features.guestAccounts ? <section className="mt-16"><h2 className="mb-6 text-3xl font-semibold text-text-primary">Guest account</h2><div className="grid gap-6 lg:grid-cols-3"><AuthCard /><ProfileCard />{features.guestBookingHistory ? <BookingHistory /> : null}</div></section> : null}</div></main>;
}
