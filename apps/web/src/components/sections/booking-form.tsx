"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchApartments, submitBooking } from "@/lib/api";
import { getAvailability } from "@/lib/availability";
import type { Apartment, BookingRequest, BookingResponse } from "@/lib/types";

type BookingFormProps = {
  initialApartmentId?: string;
};

const defaultCheckIn = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split("T")[0];
};

const defaultCheckOut = () => {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  return date.toISOString().split("T")[0];
};

const initialValues: BookingRequest = {
  apartmentId: "",
  fullName: "",
  email: "",
  phone: "",
  checkIn: defaultCheckIn(),
  checkOut: defaultCheckOut(),
  guests: 1,
  notes: "",
};

export function BookingForm({ initialApartmentId }: BookingFormProps) {
  const router = useRouter();
  const [values, setValues] = useState<BookingRequest>({
    ...initialValues,
    apartmentId: initialApartmentId ?? "",
  });
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<BookingResponse | null>(null);
  const [availabilityMessage, setAvailabilityMessage] = useState("");
  const selectedApartment = apartments.find(
    (apartment) => apartment.id === values.apartmentId,
  );
  const maximumGuests = selectedApartment?.maxGuests ?? 1;

  useEffect(() => {
    fetchApartments()
      .then((items) => {
        setApartments(items);
        setValues((current) => ({
          ...current,
          apartmentId:
            current.apartmentId &&
            items.some((item) => item.id === current.apartmentId)
              ? current.apartmentId
              : (items[0]?.id ?? ""),
        }));
      })
      .catch(() => setMessage("Apartments are temporarily unavailable."));
  }, []);

  useEffect(() => {
    if (!values.apartmentId) return;
    getAvailability(values.apartmentId)
      .then((items) => {
        if (items.length > 0) {
          setAvailabilityMessage(
            `Unavailable date ranges currently on record: ${items.length}`,
          );
          return;
        }
        setAvailabilityMessage(
          "No unavailable dates are currently on record for this apartment.",
        );
      })
      .catch(() => {
        setAvailabilityMessage("Availability data is temporarily unavailable.");
      });
  }, [values.apartmentId]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;
    setValues((current) => ({
      ...current,
      [name]: name === "guests" ? Number(value) : value,
      ...(name === "apartmentId"
        ? {
            guests: Math.min(
              current.guests,
              apartments.find((apartment) => apartment.id === value)
                ?.maxGuests ?? 1,
            ),
          }
        : {}),
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage("");

    try {
      const response = await submitBooking(values);
      setResult(response);
      setStatus("success");
      setMessage(response.message);
      const query = new URLSearchParams({ reference: response.reference });
      router.push(`/booking/confirmation?${query.toString()}`);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "We could not submit your request. Please try again.",
      );
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8"
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Reserve your stay
          </p>
          <h2 className="text-2xl font-semibold text-text-primary">
            Plan your visit in minutes
          </h2>
          <p className="text-sm text-text-secondary">
            We will confirm availability and share the next steps by email or
            phone.
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
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Phone number
            <input
              name="phone"
              required
              value={values.phone}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </label>

          <label className="text-sm font-medium text-text-primary">
            Guests
            <select
              name="guests"
              value={values.guests}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {Array.from({ length: maximumGuests }, (_, index) => index + 1).map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? "guest" : "guests"}
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
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            />
          </label>
        </div>

        <label className="mt-6 block text-sm font-medium text-text-primary">
          Apartment
          <select
            name="apartmentId"
            required
            value={values.apartmentId}
            onChange={handleChange}
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <option value="" disabled>
              Choose an apartment
            </option>
            {apartments.map((apartment) => (
              <option key={apartment.id} value={apartment.id}>
                {apartment.title}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-6 block text-sm font-medium text-text-primary">
          Notes
          <textarea
            name="notes"
            rows={4}
            value={values.notes ?? ""}
            onChange={handleChange}
            placeholder="Tell us about late arrivals, accessibility needs, or special requests."
            className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm transition focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          />
        </label>

        <div className="mt-8">
          <Button
            type="submit"
            size="lg"
            loading={status === "submitting"}
            className="w-full sm:w-auto"
          >
            Request a booking
          </Button>
        </div>

        {availabilityMessage || !values.apartmentId ? (
          <p className="mt-4 rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm text-text-secondary">
            {availabilityMessage ||
              "Choose an apartment to see its availability."}
          </p>
        ) : null}

        {message ? (
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 rounded-2xl px-4 py-3 text-sm ${status === "success" ? "bg-success/10 text-success" : "bg-error/10 text-error"}`}
          >
            {message}
          </p>
        ) : null}
      </form>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-primary/10 bg-surface-secondary p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            What this request provides
          </p>
          <ul className="mt-6 space-y-4 text-sm text-text-secondary">
            <li>• A real booking reference from the API.</li>
            <li>• A total calculated from the persisted apartment rate.</li>
            <li>• An availability check before the request is stored.</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            What happens next
          </p>
          <ol className="mt-6 space-y-4 text-sm text-text-secondary">
            <li>1. The API validates the apartment, dates and guest count.</li>
            <li>2. A pending request and reference are created.</li>
            <li>3. Red Masai must confirm the stay, policies and next steps directly.</li>
          </ol>
        </div>

        {result ? (
          <div className="rounded-3xl border border-primary/10 bg-primary/5 p-6 shadow-soft">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              Reference
            </p>
            <p className="mt-2 text-2xl font-semibold text-text-primary">
              {result.reference}
            </p>
            <p className="mt-3 text-sm text-text-secondary">
              Total:{" "}
              <span className="font-semibold text-text-primary">
                {result.currency} {result.totalAmount}
              </span>
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
