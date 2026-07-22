import Link from "next/link";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";

export function SiteHeader({ displayName = APP_NAME }: { displayName?: string }) {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="text-lg font-semibold text-text-primary">
          {displayName}
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex flex-wrap gap-x-5 gap-y-3 text-sm text-text-secondary">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
