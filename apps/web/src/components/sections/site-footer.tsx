import Link from "next/link";
import type { RedMasaiProfile } from "@/lib/types";

export function SiteFooter({ profile }: { profile?: RedMasaiProfile | null }) {
  return (
    <footer className="border-t border-border bg-surface-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-semibold text-text-primary">{profile?.displayName ?? "Red Masai Apartments"}</p>
          <p className="mt-2 text-sm text-text-secondary">{profile?.valueProposition ?? "Concept content is currently unavailable."}</p>
        </div>
        <div>
          <p className="font-semibold text-text-primary">Visit</p>
          <p className="mt-2 text-sm text-text-secondary">
            {[profile?.region, profile?.city, profile?.country].filter(Boolean).join(", ") || "Location awaiting confirmation"}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm">
          <Link href="/contact" className="font-semibold text-primary">Contact Red Masai</Link>
          <Link href="/dashboard/content" className="text-text-secondary">Owner content review</Link>
        </div>
      </div>
    </footer>
  );
}
