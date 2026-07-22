"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/api";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    void getCurrentUser()
      .then(({ user }) => {
        if (user.role === "owner" || user.role === "admin") setAuthorized(true);
        else router.replace("/");
      })
      .catch(() => router.replace("/"));
  }, [router]);

  if (!authorized)
    return (
      <p
        role="status"
        className="mx-auto max-w-6xl px-6 py-20 text-text-secondary"
      >
        Checking access…
      </p>
    );

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-semibold text-text-primary">
        Red Masai dashboard
      </h1>
      <p className="mt-4 text-text-secondary">
        The full operations dashboard is deferred. Current protected tools
        remain focused on real bookings, availability and owner content review.
      </p>
      <Link
        href="/dashboard/content"
        className="mt-8 inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white"
      >
        Review website content
      </Link>
    </section>
  );
}
