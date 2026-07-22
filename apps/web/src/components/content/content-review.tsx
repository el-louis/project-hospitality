"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createOffering, getCurrentUser, getManagedOfferings, getManagedProfile, updateManagedProfile, updateOffering } from "@/lib/api";
import type { Offering, ProtectedRedMasaiProfile } from "@/lib/types";
import { OfferingEditor, blankOffering } from "./offering-editor";
import { ProfileEditor } from "./profile-editor";

export function ContentReview() {
  const [profile, setProfile] = useState<ProtectedRedMasaiProfile | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [draft, setDraft] = useState(blankOffering);
  const [status, setStatus] = useState("Checking access…");
  const [saving, setSaving] = useState(false);

  useEffect(() => { void getCurrentUser().then(({ user }) => {
    if (user.role !== "owner" && user.role !== "admin") throw new Error("Owner or admin access is required.");
    return Promise.all([getManagedProfile(), getManagedOfferings()]);
  }).then(([nextProfile, nextOfferings]) => { setProfile(nextProfile); setOfferings(nextOfferings); setStatus(""); }).catch((error: unknown) => setStatus(error instanceof Error ? error.message : "Access unavailable.")); }, []);

  async function saveProfile() { if (!profile) return; setSaving(true); try { const payload: Partial<ProtectedRedMasaiProfile> = { ...profile }; delete payload.id; delete payload.createdAt; delete payload.updatedAt; setProfile(await updateManagedProfile(payload)); setStatus("Profile saved."); } catch (error) { setStatus(error instanceof Error ? error.message : "Save failed."); } finally { setSaving(false); } }
  async function saveOffering(offering: Offering) { setSaving(true); try { const { id, ...payload } = offering; const updated = await updateOffering(id, payload); setOfferings((items) => items.map((item) => item.id === id ? updated : item)); setStatus("Offering saved."); } catch (error) { setStatus(error instanceof Error ? error.message : "Save failed."); } finally { setSaving(false); } }
  async function addOffering() { setSaving(true); try { const created = await createOffering(draft); setOfferings((items) => [...items, created]); setDraft(blankOffering); setStatus("Offering created."); } catch (error) { setStatus(error instanceof Error ? error.message : "Create failed."); } finally { setSaving(false); } }

  if (!profile) return <p role="status" className="mx-auto max-w-6xl px-6 py-20 text-text-secondary">{status}</p>;
  const unresolved = Object.entries(profile.fieldConfidence).filter(([, confidence]) => confidence === "OWNER_REQUIRED");
  return <main className="mx-auto max-w-6xl space-y-8 px-4 py-12 sm:px-6"><header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Protected owner review</p><h1 className="mt-3 text-4xl font-semibold text-text-primary">Red Masai content</h1></div><Link href="/" className="rounded-full border border-primary px-5 py-2 font-semibold text-primary">Preview public content</Link></header>{status ? <p role="status" className="rounded-xl bg-primary/5 px-4 py-3 text-sm text-text-secondary">{status}</p> : null}<section className="rounded-2xl border border-warning/40 bg-warning/10 p-6"><h2 className="text-xl font-semibold text-text-primary">Owner feedback checklist</h2><p className="mt-2 text-sm text-text-secondary">{unresolved.length} profile fields currently require owner confirmation.</p><ul className="mt-4 grid gap-2 text-sm text-text-secondary sm:grid-cols-2 md:grid-cols-3">{unresolved.map(([field]) => <li key={field}>• {field}</li>)}</ul><p className="mt-4 text-sm text-text-secondary">Also confirm current prices, apartment inventory, capacities, package inclusions, deposits, payment methods, event and noise rules, cleaning/setup charges, identification requirements, transport definition and cancellation policy.</p></section><ProfileEditor profile={profile} saving={saving} onChange={setProfile} onSave={() => void saveProfile()} /><section><h2 className="mb-5 text-2xl font-semibold text-text-primary">Published and draft offerings</h2><div className="space-y-6">{offerings.map((offering) => <OfferingEditor key={offering.id} title={offering.title} value={offering} saving={saving} onChange={(next) => setOfferings((items) => items.map((item) => item.id === offering.id ? next as Offering : item))} onSave={() => void saveOffering(offering)} />)}</div></section><OfferingEditor title="Create a new offering" value={draft} saving={saving} onChange={(next) => setDraft(next as Omit<Offering, "id">)} onSave={() => void addOffering()} /></main>;
}
