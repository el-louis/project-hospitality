import { AuthCard } from '@/components/sections/auth-card';
import { BookingHistory } from '@/components/sections/booking-history';
import { ProfileCard } from '@/components/sections/profile-card';

export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-20">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary">Hospitality</p>
          <h1 className="max-w-3xl text-4xl font-semibold text-text-primary sm:text-6xl">
            Discover refined stays and effortless booking.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-text-secondary">
            A polished experience for browsing apartments, planning your stay, and managing reservations.
          </p>
        </div>

        <div className="space-y-6">
          <AuthCard />
          <ProfileCard />
          <BookingHistory />
        </div>
      </div>
    </section>
  );
}
