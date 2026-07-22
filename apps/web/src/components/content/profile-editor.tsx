"use client";

import { Button } from "@/components/ui/button";
import type { ContentConfidence, ProtectedRedMasaiProfile } from "@/lib/types";

const editableFields = [
  ["displayName", "Official display name"], ["tagline", "Working tagline"], ["valueProposition", "Value proposition"],
  ["shortDescription", "Homepage supporting copy"], ["fullDescription", "Full description"], ["phone", "Phone"],
  ["whatsapp", "WhatsApp"], ["email", "Email"], ["address", "Exact address"], ["city", "City"],
  ["region", "Region"], ["country", "Country"], ["timezone", "Timezone"], ["checkInTime", "Check-in time"],
  ["checkOutTime", "Check-out time"], ["defaultCurrency", "Default currency"], ["bookingInstructions", "Booking instructions"],
  ["cancellationSummary", "Cancellation summary"], ["previewNotice", "Preview notice"],
] as const;

const confidenceOptions: ContentConfidence[] = ["CONFIRMED", "ASSUMED_DEMO", "OWNER_REQUIRED"];

export function ProfileEditor({ profile, saving, onChange, onSave }: {
  profile: ProtectedRedMasaiProfile; saving: boolean;
  onChange: (profile: ProtectedRedMasaiProfile) => void; onSave: () => void;
}) {
  return <section className="rounded-2xl border border-border bg-surface p-6"><div className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="text-2xl font-semibold text-text-primary">Red Masai profile</h2><p className="mt-1 text-sm text-text-secondary">Public copy and owner-review state are stored separately in one singleton record.</p></div><Button type="button" loading={saving} onClick={onSave}>Save profile</Button></div><div className="mt-8 grid gap-5 md:grid-cols-2">{editableFields.map(([key, label]) => {
    const multiline = ["shortDescription", "fullDescription", "bookingInstructions", "cancellationSummary", "previewNotice"].includes(key);
    const value = profile[key] == null ? "" : String(profile[key]);
    return <div key={key} className={multiline ? "md:col-span-2" : ""}><label className="block text-sm font-medium text-text-primary">{label}{multiline ? <textarea rows={key === "fullDescription" ? 5 : 3} value={value} onChange={(event) => onChange({ ...profile, [key]: event.target.value || null })} className="mt-2 w-full rounded-xl border border-border px-3 py-2" /> : <input type={key === "email" ? "email" : key.includes("Time") ? "time" : "text"} value={value} onChange={(event) => onChange({ ...profile, [key]: event.target.value || null })} className="mt-2 w-full rounded-xl border border-border px-3 py-2" />}</label><label className="mt-2 block text-xs text-text-secondary">Review status<select value={profile.fieldConfidence[key] ?? "OWNER_REQUIRED"} onChange={(event) => onChange({ ...profile, fieldConfidence: { ...profile.fieldConfidence, [key]: event.target.value as ContentConfidence } })} className="mt-1 w-full rounded-lg border border-border bg-surface-secondary px-2 py-2 text-sm">{confidenceOptions.map((status) => <option key={status} value={status}>{status}</option>)}</select></label></div>;
  })}</div></section>;
}
