'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getProfile, getStoredSession, updateProfile } from '@/lib/api';
import type { ProfileResponse, ProfileUpdatePayload } from '@/lib/types';

type ProfileCardProps = {
  userId?: string;
};

export function ProfileCard({ userId }: ProfileCardProps) {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<ProfileUpdatePayload>({
    fullName: '',
    phone: '',
    location: '',
    bio: '',
  });

  const activeUserId = userId ?? getStoredSession()?.user.id ?? 'user-demo';

  const loadProfile = async () => {
    try {
      const data = await getProfile(activeUserId);
      setProfile(data);
      setForm({
        fullName: data.fullName,
        phone: data.phone ?? '',
        location: data.location ?? '',
        bio: data.bio ?? '',
      });
    } catch {
      setMessage('We could not load your profile right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updated = await updateProfile(activeUserId, form);
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } catch {
      setMessage('We could not update your profile right now.');
    }
  };

  useEffect(() => {
    void loadProfile();
  }, [activeUserId]);

  return (
    <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Your account</p>
          <h2 className="mt-2 text-2xl font-semibold text-text-primary">Profile details</h2>
        </div>
        <Button type="button" variant="ghost" onClick={loadProfile}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-text-secondary">Loading your profile…</p>
      ) : profile ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-text-primary">
            Full name
            <input
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-text-primary">
            Phone
            <input
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-text-primary">
            Location
            <input
              value={form.location}
              onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-text-primary">
            Bio
            <textarea
              rows={4}
              value={form.bio}
              onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>

          <Button type="submit" className="w-full">Save profile</Button>
        </form>
      ) : null}

      {message ? <p className="mt-4 rounded-2xl bg-primary/5 px-4 py-3 text-sm text-text-secondary">{message}</p> : null}
    </div>
  );
}
