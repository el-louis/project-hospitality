"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { AUTH_STATE_EVENT, getProfile, updateProfile } from "@/lib/api";
import type { ProfileResponse, ProfileUpdatePayload } from "@/lib/types";

export function ProfileCard() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState<ProfileUpdatePayload>({
    firstName: "",
    lastName: "",
    phone: "",
  });

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? "",
      });
    } catch {
      setMessage("We could not load your profile right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setMessage("Profile updated successfully.");
    } catch {
      setMessage("We could not update your profile right now.");
    }
  };

  useEffect(() => {
    const reload = () => void loadProfile();
    const initialLoad = window.setTimeout(reload, 0);
    window.addEventListener(AUTH_STATE_EVENT, reload);
    return () => {
      window.clearTimeout(initialLoad);
      window.removeEventListener(AUTH_STATE_EVENT, reload);
    };
  }, []);

  return (
    <div className="rounded-3xl border border-primary/10 bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Your account
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-text-primary">
            Profile details
          </h2>
        </div>
        <Button type="button" variant="ghost" onClick={loadProfile}>
          Refresh
        </Button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-text-secondary">
          Loading your profile…
        </p>
      ) : profile ? (
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-medium text-text-primary">
            First name
            <input
              value={form.firstName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  firstName: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-text-primary">
            Last name
            <input
              value={form.lastName}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  lastName: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <label className="block text-sm font-medium text-text-primary">
            Phone
            <input
              value={form.phone}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  phone: event.target.value,
                }))
              }
              className="mt-2 w-full rounded-2xl border border-border bg-surface-secondary px-4 py-3 text-sm"
            />
          </label>
          <Button type="submit" className="w-full">
            Save profile
          </Button>
        </form>
      ) : null}

      {message ? (
        <p
          role="status"
          aria-live="polite"
          className="mt-4 rounded-2xl bg-primary/5 px-4 py-3 text-sm text-text-secondary"
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
