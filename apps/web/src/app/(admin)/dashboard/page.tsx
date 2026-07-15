'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    void getCurrentUser()
      .then(({ user }) => {
        if (user.role === 'owner' || user.role === 'admin') setAuthorized(true);
        else router.replace('/');
      })
      .catch(() => router.replace('/'));
  }, [router]);

  if (!authorized) return <p role="status" className="mx-auto max-w-6xl px-6 py-20 text-text-secondary">Checking access…</p>;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <h1 className="text-3xl font-semibold text-text-primary">Admin Dashboard</h1>
      <p className="mt-4 text-text-secondary">Overview of reservations, occupancy, and management tools.</p>
    </section>
  );
}
