'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { submitBooking } from '@/lib/api';
import { getAvailability } from '@/lib/availability';
import type { BookingRequest, BookingResponse } from '@/lib/types';

type BookingFormProps = {
  apartmentName?: string;
};

const defaultCheckIn = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
};

const defaultCheckOut = () => {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split('T')[0];
};

const initialValues: BookingRequest = {
  fullName: '',
  email: '',
  phone: '',
  checkIn: defaultCheckIn(),
  checkOut: defaultCheckOut(),
  guests: 2,
  apartmentPreference: '',
  notes: '',
};

export function BookingForm({ apartmentName }: BookingFormProps) {
  const [values, setValues] = useState<BookingRequest>({
    ...initialValues,
    apartmentPreference: apartmentName ?? '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState('');

  useEffect(() => {
    const apartmentId = values.apartmentPreference?.trim() || 'default-apartment';
    getAvailability(apartmentId)
      .then((items) => {
        if (items.length > 0) {
          setAvailabilityMessage(`Blocked dates currently on record: ${items.length}`);
          return;
        }
        setAvailabilityMessage('No blocked dates are currently on record for this apartment.');
      })
      .catch(() => {
        setAvailabilityMessage('Availability data is temporarily unavailable.');
      });
  }, [values.apartmentPreference]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: name === 'guests' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('submitting');
    setMessage('');

    try {
      const response = await submitBooking(values);
      setResult(response);
      setStatus('success');
      setMessage(response.message);
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'We could not submit your request. Please try again.');
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8"
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Reserve your stay</p>
          <h2 className="text-2xl font-semibold text-text-primary">Plan your visit in minutes</h2>
          <p className="text-sm text-text-secondary">
            We will confirm availability and share the next steps by email or phone.
          </p>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <label className="text-sm font-medium text-text-primary">
            Full name
            <input
              name="fullName"
              required
              value={values.fullName}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Email address
            <input
              type="email"
              name="email"
              required
              value={values.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Phone number
            <input
              name="phone"
              required
              value={values.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Guests
            <select
              name="guests"
              value={values.guests}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            >
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-medium text-text-primary">
            Check-in
            <input
              type="date"
              name="checkIn"
              required
              value={values.checkIn}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Check-out
            <input
              type="date"
              name="checkOut"
              required
              value={values.checkOut}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
            />
          </label>
        </div>

        <label className="mt-6 block text-sm font-medium text-text-primary">
          Preferred apartment
          <input
            name="apartmentPreference"
            value={values.apartmentPreference ?? ''}
            onChange={handleChange}
            placeholder="Studio Garden View"
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
          />
        </label>

        <label className="mt-6 block text-sm font-medium text-text-primary">
          Notes
          <textarea
            name="notes"
            rows={4}
            value={values.notes ?? ''}
            onChange={handleChange}
            placeholder="Tell us about late arrivals, accessibility needs, or special requests."
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm outline-none ring-0 transition focus:border-primary"
          />
        </label>

        <div className="mt-8">
          <Button type="submit" size="lg" loading={status === 'submitting'} className="w-full sm:w-auto">
            Request a booking
          </Button>
        </div>

        {availabilityMessage ? (
          <p className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
            {availabilityMessage}
          </p>
        ) : null}

        {message ? (
          <p
            className={`mt-4 rounded-2xl px-4 py-3 text-sm ${status === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'}`}
          >
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-primary/10 bg-surface-secondary p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Why guests choose us</p>
          <ul className="mt-6 space-y-4 text-sm text-text-secondary">
            <li>• Fast confirmation with human support.</li>
            <li>• Flexible stays with clear pricing.</li>
            <li>• Thoughtful amenities for work and leisure.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">What happens next</p>
          <ol className="mt-6 space-y-4 text-sm text-text-secondary">
            <li>1. We review your dates and availability.</li>
            <li>2. We send a tailored response within one business day.</li>
            <li>3. Your stay is confirmed once payment details are shared.</li>
          </ol>
        </div>

        {result ? (
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Reference</p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">{result.reference}</p>
            <p className="mt-3 text-sm text-text-secondary">
              Estimated total: <span className="font-semibold text-text-primary">${result.estimatedTotal}</span>
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
