import Link from "next/link";
import type { RedMasaiProfile } from "@/lib/types";
import { NAV_ITEMS } from "@/lib/constants";

export function SiteFooter({ profile }: { profile?: RedMasaiProfile | null }) {
  return (
    <footer className="border-t border-border bg-[#2d2523] text-[#f9f1e8]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="font-display text-2xl font-bold">
            {profile?.displayName ?? "Red Masai Apartments"}
          </p>
          <p className="mt-3 max-w-sm text-sm text-[#d9cbc2]">
            {profile?.valueProposition ??
              "Concept content is currently unavailable."}
          </p>
          <p className="mt-5 text-xs uppercase tracking-[0.2em] text-secondary">
            Concept preview · Owner review pending
          </p>
        </div>
        <div>
          <p className="font-semibold">Explore</p>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-[#d9cbc2]">
            {NAV_ITEMS.slice(0, 8).map((item) => (
              <li key={item.href}>
                <Link className="hover:text-white" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Working location</p>
          <p className="mt-3 text-sm text-[#d9cbc2]">
            {[profile?.region, profile?.city, profile?.country]
              .filter(Boolean)
              .join(", ") || "Location awaiting confirmation"}
          </p>
          <div className="mt-5 flex flex-col items-start gap-2 text-sm">
            <Link
              href="/contact"
              className="font-semibold text-secondary hover:text-white"
            >
              Plan an enquiry →
            </Link>
            <Link
              href="/dashboard/content"
              className="text-[#d9cbc2] hover:text-white"
            >
              Owner content review
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
