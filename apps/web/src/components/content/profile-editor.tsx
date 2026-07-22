"use client";

import { Button } from "@/components/ui/button";
import type { ContentConfidence, ProtectedRedMasaiProfile } from "@/lib/types";

const editableFields = [
  ["displayName", "Official display name"],
  ["tagline", "Working tagline"],
  ["valueProposition", "Value proposition"],
  ["shortDescription", "Homepage supporting copy"],
  ["fullDescription", "Full description"],
  ["phone", "Phone"],
  ["whatsapp", "WhatsApp"],
  ["email", "Email"],
  ["address", "Exact address"],
  ["city", "City"],
  ["region", "Region"],
  ["country", "Country"],
  ["timezone", "Timezone"],
  ["checkInTime", "Check-in time"],
  ["checkOutTime", "Check-out time"],
  ["defaultCurrency", "Default currency"],
  ["bookingInstructions", "Booking instructions"],
  ["cancellationSummary", "Cancellation summary"],
  ["previewNotice", "Preview notice"],
  ["logoUrl", "Logo URL"],
  ["coverImageUrl", "Cover image URL"],
  ["instagramUrl", "Instagram URL"],
] as const;

const confidenceOptions: { value: ContentConfidence; label: string }[] = [
  { value: "CONFIRMED", label: "Confirmed by owner" },
  { value: "ASSUMED_DEMO", label: "Demo assumption" },
  { value: "OWNER_REQUIRED", label: "Owner input needed" },
];

export function ProfileEditor({
  profile,
  saving,
  onChange,
  onSave,
}: {
  profile: ProtectedRedMasaiProfile;
  saving: boolean;
  onChange: (profile: ProtectedRedMasaiProfile) => void;
  onSave: () => void;
}) {
  return (
    <section className="rounded-3xl border border-border bg-surface p-5 sm:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-text-primary">
            Public profile and story
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            Edit the wording guests see, then choose the review state that best
            describes it.
          </p>
        </div>
        <Button
          type="button"
          loading={saving}
          onClick={onSave}
          className="min-h-11"
        >
          Save profile
        </Button>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {editableFields.map(([key, label]) => {
          const multiline = [
            "shortDescription",
            "fullDescription",
            "bookingInstructions",
            "cancellationSummary",
            "previewNotice",
          ].includes(key);
          const value = profile[key] == null ? "" : String(profile[key]);
          return (
            <div
              key={key}
              className={`rounded-2xl border border-border p-4 ${multiline ? "md:col-span-2" : ""}`}
            >
              <label className="block text-sm font-semibold text-text-primary">
                {label}
                {multiline ? (
                  <textarea
                    rows={key === "fullDescription" ? 5 : 3}
                    value={value}
                    onChange={(event) =>
                      onChange({
                        ...profile,
                        [key]: event.target.value || null,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2"
                  />
                ) : (
                  <input
                    type={
                      key === "email"
                        ? "email"
                        : key.includes("Time")
                          ? "time"
                          : key.includes("Url")
                            ? "url"
                            : "text"
                    }
                    value={value}
                    onChange={(event) =>
                      onChange({
                        ...profile,
                        [key]: event.target.value || null,
                      })
                    }
                    className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2"
                  />
                )}
              </label>
              <label className="mt-3 block text-xs font-semibold text-text-secondary">
                Review state
                <select
                  value={profile.fieldConfidence[key] ?? "OWNER_REQUIRED"}
                  onChange={(event) =>
                    onChange({
                      ...profile,
                      fieldConfidence: {
                        ...profile.fieldConfidence,
                        [key]: event.target.value as ContentConfidence,
                      },
                    })
                  }
                  className="mt-1 min-h-11 w-full rounded-lg border border-border bg-surface-secondary px-2 py-2 text-sm text-text-primary"
                >
                  {confidenceOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          );
        })}
      </div>
    </section>
  );
}
