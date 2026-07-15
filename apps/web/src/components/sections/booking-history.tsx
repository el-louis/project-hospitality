'use client';

import { useEffect, useState } from 'react';
import { AUTH_STATE_EVENT, getUserBookings } from '@/lib/api';
import type { BookingSummary } from '@/lib/types';

export function BookingHistory() {
  const [bookings, setBookings] = useState<BookingSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setLoading(false);
      }
    }

    const reload = () => void loadBookings();
    void loadBookings();
    window.addEventListener(AUTH_STATE_EVENT, reload);
    return () => window.removeEventListener(AUTH_STATE_EVENT, reload);
  }, []);

  return (
    <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Your bookings</p>
      <h2 className="mt-2 text-2xl font-semibold text-text-primary">Booking history</h2>

      {loading ? (
        <p className="mt-6 text-sm text-text-secondary">Loading your reservations…</p>
      ) : bookings.length === 0 ? (
        <p className="mt-6 text-sm text-text-secondary">You have no bookings yet.</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {bookings.map((booking) => (
            <li key={booking.reference} className="rounded-2xl border border-border bg-surface-secondary p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-semibold text-text-primary">{booking.reference}</p>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {booking.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-text-secondary">
                {booking.checkIn} → {booking.checkOut} • {booking.guests} guests
              </p>
              <p className="mt-2 text-sm text-text-secondary">Estimated total: ${booking.estimatedTotal}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
