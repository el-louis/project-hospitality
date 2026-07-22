"use client";

import { Menu, UserRound, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function SiteHeader({
  displayName = APP_NAME,
  onlineBooking = true,
}: {
  displayName?: string;
  onlineBooking?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/95 backdrop-blur">
      <div className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="min-w-0 font-display text-lg font-bold text-text-primary sm:text-xl"
        >
          <span className="block truncate">{displayName}</span>
          <span className="block font-sans text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-primary">
            Concept preview
          </span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden xl:block">
          <ul className="flex items-center gap-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  className={`block rounded-full px-3 py-2 font-medium transition-colors hover:bg-primary/8 hover:text-primary ${pathname === item.href ? "text-primary" : "text-text-secondary"}`}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          {onlineBooking ? (
            <Link
              href="/booking"
              className="hidden min-h-11 items-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-accent sm:inline-flex"
            >
              Book a stay
            </Link>
          ) : null}
          <Link
            href="/dashboard"
            aria-label="Account and dashboard"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-text-secondary hover:border-primary hover:text-primary"
          >
            <UserRound size={19} />
          </Link>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-primary xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="border-t border-border bg-surface px-4 pb-5 pt-3 xl:hidden"
        >
          <ul className="mx-auto grid max-w-7xl gap-1 sm:grid-cols-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block min-h-11 rounded-xl px-4 py-3 font-medium text-text-primary hover:bg-surface-secondary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {onlineBooking ? (
            <Link
              href="/booking"
              onClick={() => setOpen(false)}
              className="mx-auto mt-3 flex min-h-12 max-w-7xl items-center justify-center rounded-full bg-primary px-5 font-semibold text-white"
            >
              Book a stay
            </Link>
          ) : null}
        </nav>
      ) : null}
    </header>
  );
}
