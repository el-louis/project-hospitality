import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Booking request received",
  description:
    "Review the backend-generated reference for a pending Red Masai stay request.",
};

export default async function BookingConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  const { reference } = await searchParams;
  const validReference =
    reference && /^RM-\d{8}-[A-F0-9]{12}$/.test(reference) ? reference : null;
  return (
    <main className="bg-surface px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-surface p-6 text-center shadow-lg sm:p-10">
        <span
          className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e5eadf] text-[#3f5e3f]"
          aria-hidden="true"
        >
          <CheckCircle2 size={28} />
        </span>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Booking request received
        </p>
        <h1 className="text-balance mt-4 text-4xl font-semibold text-text-primary sm:text-5xl">
          Your stay request has a reference
        </h1>
        {validReference ? (
          <>
            <p className="mt-8 text-sm text-text-secondary">
              Keep this booking reference
            </p>
            <p className="mt-2 break-all font-mono text-2xl font-bold text-primary sm:text-3xl">
              {validReference}
            </p>
            <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-surface-secondary p-5 text-left text-sm leading-6 text-text-secondary">
              <strong className="text-text-primary">
                This is not payment confirmation or final stay confirmation.
              </strong>{" "}
              Red Masai must confirm availability, policies and next steps
              directly. No payment has been collected by this prototype.
            </div>
          </>
        ) : (
          <p className="mt-6 text-text-secondary">
            No valid booking reference was provided. Submit the booking form to
            create a real request.
          </p>
        )}
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/apartments"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-primary px-6 font-bold text-primary"
          >
            View stays
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 font-bold text-white"
          >
            Contact Red Masai
          </Link>
        </div>
      </div>
    </main>
  );
}
