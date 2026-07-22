"use client";

import { CheckCircle2, CircleHelp, Eye, Lightbulb } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  createOffering,
  getCurrentUser,
  getManagedOfferings,
  getManagedProfile,
  updateManagedProfile,
  updateOffering,
} from "@/lib/api";
import type {
  ContentConfidence,
  Offering,
  ProtectedRedMasaiProfile,
} from "@/lib/types";
import { OfferingEditor, blankOffering } from "./offering-editor";
import { ProfileEditor } from "./profile-editor";

const reviewGroups = [
  {
    title: "Identity",
    fields: [
      "displayName",
      "tagline",
      "valueProposition",
      "shortDescription",
      "fullDescription",
    ],
    prompts: ["Official business name", "Final positioning and story"],
  },
  {
    title: "Contact",
    fields: ["phone", "whatsapp", "email", "socialLinks", "instagramUrl"],
    prompts: ["Official phone, WhatsApp and email", "Approved social links"],
  },
  {
    title: "Apartments",
    fields: [],
    prompts: [
      "Current apartment inventory",
      "Apartment names, amenities and capacities",
    ],
  },
  {
    title: "Prices",
    fields: ["defaultCurrency"],
    prompts: [
      "Current apartment and package prices",
      "Cleaning or setup charges",
    ],
  },
  {
    title: "Policies",
    fields: [
      "checkInTime",
      "checkOutTime",
      "bookingInstructions",
      "cancellationSummary",
    ],
    prompts: [
      "Deposit and payment methods",
      "Cancellation, identification and noise rules",
    ],
  },
  {
    title: "Experiences",
    fields: [],
    prompts: [
      "Cinema, garden and dinner inclusions",
      "Duration, capacity and active services",
    ],
  },
  {
    title: "Events",
    fields: [],
    prompts: [
      "Event capacity and hours",
      "Setup, catering and gathering rules",
    ],
  },
  {
    title: "Creative shoots",
    fields: [],
    prompts: [
      "Crew limits and duration",
      "Equipment, power and overtime terms",
    ],
  },
  {
    title: "Media",
    fields: ["logoUrl", "coverImageUrl"],
    prompts: [
      "Approved logo and cover image",
      "Apartment, garden, cinema, event and shoot photography",
    ],
  },
  {
    title: "Location",
    fields: ["address", "latitude", "longitude", "city", "region", "country"],
    prompts: ["Exact address and map pin", "Approved exterior and directions"],
  },
] as const;

const confidenceMeta: Record<
  ContentConfidence,
  { label: string; icon: typeof CheckCircle2; className: string }
> = {
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    className: "bg-[#e5eadf] text-[#34523a]",
  },
  ASSUMED_DEMO: {
    label: "Demo assumption",
    icon: Lightbulb,
    className: "bg-[#efe2d4] text-[#72491e]",
  },
  OWNER_REQUIRED: {
    label: "Owner input needed",
    icon: CircleHelp,
    className: "bg-[#f1e1e2] text-[#762f3d]",
  },
};

export function ContentReview() {
  const [profile, setProfile] = useState<ProtectedRedMasaiProfile | null>(null);
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [draft, setDraft] = useState(blankOffering);
  const [status, setStatus] = useState("Checking secure access…");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    void getCurrentUser()
      .then(({ user }) => {
        if (user.role !== "owner" && user.role !== "admin")
          throw new Error("Owner or admin access is required.");
        return Promise.all([getManagedProfile(), getManagedOfferings()]);
      })
      .then(([nextProfile, nextOfferings]) => {
        setProfile(nextProfile);
        setOfferings(nextOfferings);
        setStatus("");
      })
      .catch((error: unknown) =>
        setStatus(
          error instanceof Error ? error.message : "Access unavailable.",
        ),
      );
  }, []);
  async function saveProfile() {
    if (!profile) return;
    setSaving(true);
    try {
      const payload: Partial<ProtectedRedMasaiProfile> = { ...profile };
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      setProfile(await updateManagedProfile(payload));
      setStatus(
        "Profile saved. Review the public preview to check the result.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }
  async function saveOffering(offering: Offering) {
    setSaving(true);
    try {
      const { id, ...payload } = offering;
      const updated = await updateOffering(id, payload);
      setOfferings((items) =>
        items.map((item) => (item.id === id ? updated : item)),
      );
      setStatus("Offering saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }
  async function addOffering() {
    setSaving(true);
    try {
      const created = await createOffering(draft);
      setOfferings((items) => [...items, created]);
      setDraft(blankOffering);
      setStatus("Offering created.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Create failed.");
    } finally {
      setSaving(false);
    }
  }
  if (!profile)
    return (
      <main className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h1 className="text-3xl font-semibold">Owner content review</h1>
        <p role="status" className="mt-4 text-text-secondary">
          {status}
        </p>
      </main>
    );
  const counts = Object.values(profile.fieldConfidence).reduce<
    Record<ContentConfidence, number>
  >((total, value) => ({ ...total, [value]: total[value] + 1 }), {
    CONFIRMED: 0,
    ASSUMED_DEMO: 0,
    OWNER_REQUIRED: 0,
  });
  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 sm:py-14">
      <header className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
            Protected owner workspace
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-text-primary sm:text-5xl">
            Review the Red Masai concept
          </h1>
          <p className="mt-3 max-w-2xl text-text-secondary">
            Correct the story, identify assumptions and provide the details
            guests need. Technical settings and feature flags cannot be changed
            here.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary px-5 font-bold text-primary"
        >
          <Eye size={18} /> Preview public website
        </Link>
      </header>
      {status ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-xl bg-primary/8 px-4 py-3 text-sm text-text-secondary"
        >
          {status}
        </p>
      ) : null}
      <section aria-labelledby="review-summary">
        <h2
          id="review-summary"
          className="text-3xl font-semibold text-text-primary"
        >
          Review at a glance
        </h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {(Object.keys(confidenceMeta) as ContentConfidence[]).map((key) => {
            const meta = confidenceMeta[key];
            const Icon = meta.icon;
            return (
              <div key={key} className={`rounded-2xl p-5 ${meta.className}`}>
                <Icon size={21} aria-hidden="true" />
                <p className="mt-3 text-3xl font-bold">{counts[key]}</p>
                <p className="text-sm font-semibold">{meta.label} fields</p>
              </div>
            );
          })}
        </div>
      </section>
      <section className="rounded-3xl border border-border bg-surface-secondary p-5 sm:p-7">
        <h2 className="text-3xl font-semibold text-text-primary">
          Questions for the owners
        </h2>
        <p className="mt-2 text-text-secondary">
          Use these groups during the demo. A group may include both profile
          fields and operational decisions not yet stored in this simple editor.
        </p>
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {reviewGroups.map((group) => {
            const unresolved = group.fields.filter(
              (field) => profile.fieldConfidence[field] !== "CONFIRMED",
            ).length;
            return (
              <article key={group.title} className="rounded-2xl bg-surface p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold">{group.title}</h3>
                  {group.fields.length ? (
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                      {unresolved} to review
                    </span>
                  ) : null}
                </div>
                <ul className="mt-4 space-y-2 text-sm text-text-secondary">
                  {group.prompts.map((prompt) => (
                    <li key={prompt}>• {prompt}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>
      <ProfileEditor
        profile={profile}
        saving={saving}
        onChange={setProfile}
        onSave={() => void saveProfile()}
      />
      <section>
        <div className="mb-5">
          <h2 className="text-3xl font-semibold text-text-primary">
            Published and draft offerings
          </h2>
          <p className="mt-2 text-text-secondary">
            Review active state, order, pricing notes and whether each item is
            confirmed or still a concept assumption.
          </p>
        </div>
        <div className="space-y-6">
          {offerings.map((offering) => (
            <OfferingEditor
              key={offering.id}
              title={offering.title}
              value={offering}
              saving={saving}
              onChange={(next) =>
                setOfferings((items) =>
                  items.map((item) =>
                    item.id === offering.id ? (next as Offering) : item,
                  ),
                )
              }
              onSave={() => void saveOffering(offering)}
            />
          ))}
        </div>
      </section>
      <OfferingEditor
        title="Create a new offering"
        value={draft}
        saving={saving}
        onChange={(next) => setDraft(next as Omit<Offering, "id">)}
        onSave={() => void addOffering()}
      />
    </main>
  );
}
