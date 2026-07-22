"use client";

import { Button } from "@/components/ui/button";
import type { ContentConfidence, Offering, OfferingBookingMethod, OfferingCategory } from "@/lib/types";

export const blankOffering: Omit<Offering, "id"> = {
  category: "EXPERIENCE", slug: "", title: "", shortSummary: "", fullDescription: "",
  startingPrice: null, currency: "TZS", pricingNote: null, capacity: null, durationNote: null,
  includedItems: [], additionalChargeNote: null, bookingMethod: "ENQUIRY", whatsappAction: true,
  imageUrl: null, active: true, featured: false, displayOrder: 0, contentConfidence: "OWNER_REQUIRED",
};

export function OfferingEditor({ value, title, saving, onChange, onSave }: {
  value: Omit<Offering, "id"> | Offering; title: string; saving: boolean;
  onChange: (offering: Omit<Offering, "id"> | Offering) => void; onSave: () => void;
}) {
  const change = (key: keyof Omit<Offering, "id">, next: unknown) => onChange({ ...value, [key]: next });
  return <section className="rounded-2xl border border-border bg-surface p-6"><div className="flex flex-wrap items-center justify-between gap-4"><h3 className="text-xl font-semibold text-text-primary">{title}</h3><Button type="button" loading={saving} onClick={onSave}>Save offering</Button></div><div className="mt-6 grid gap-4 md:grid-cols-2">
    <Field label="Title" value={value.title} onChange={(v) => change("title", v)} />
    <Field label="Slug" value={value.slug} onChange={(v) => change("slug", v)} />
    <Select label="Category" value={value.category} values={["STAY", "CELEBRATE", "EXPERIENCE", "CREATE"]} onChange={(v) => change("category", v as OfferingCategory)} />
    <Select label="Booking method" value={value.bookingMethod} values={["DIRECT_BOOKING", "ENQUIRY", "WHATSAPP"]} onChange={(v) => change("bookingMethod", v as OfferingBookingMethod)} />
    <Field label="Currency" value={value.currency} onChange={(v) => change("currency", v.toUpperCase())} />
    <Field label="Starting price" type="number" value={value.startingPrice ?? ""} onChange={(v) => change("startingPrice", v === "" ? null : Number(v))} />
    <Field label="Capacity" type="number" value={value.capacity ?? ""} onChange={(v) => change("capacity", v === "" ? null : Number(v))} />
    <Field label="Display order" type="number" value={value.displayOrder} onChange={(v) => change("displayOrder", Number(v))} />
    <TextArea label="Short summary" value={value.shortSummary} onChange={(v) => change("shortSummary", v)} />
    <TextArea label="Full description" value={value.fullDescription} onChange={(v) => change("fullDescription", v)} />
    <TextArea label="Pricing note" value={value.pricingNote ?? ""} onChange={(v) => change("pricingNote", v || null)} />
    <TextArea label="Additional-charge note" value={value.additionalChargeNote ?? ""} onChange={(v) => change("additionalChargeNote", v || null)} />
    <Select label="Confidence" value={value.contentConfidence ?? "OWNER_REQUIRED"} values={["CONFIRMED", "ASSUMED_DEMO", "OWNER_REQUIRED"]} onChange={(v) => change("contentConfidence", v as ContentConfidence)} />
    <div className="flex flex-wrap items-center gap-5">
      <Check label="Active" checked={Boolean(value.active)} onChange={(checked) => change("active", checked)} />
      <Check label="Featured" checked={value.featured} onChange={(checked) => change("featured", checked)} />
      <Check label="WhatsApp action" checked={value.whatsappAction} onChange={(checked) => change("whatsappAction", checked)} />
    </div>
  </div></section>;
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string | number; onChange: (value: string) => void; type?: string }) { return <label className="text-sm font-medium text-text-primary">{label}<input required type={type} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2" /></label>; }
function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="text-sm font-medium text-text-primary">{label}<textarea required={label === "Short summary" || label === "Full description"} rows={3} value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border px-3 py-2" /></label>; }
function Select({ label, value, values, onChange }: { label: string; value: string; values: readonly string[]; onChange: (value: string) => void }) { return <label className="text-sm font-medium text-text-primary">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-xl border border-border bg-surface px-3 py-2">{values.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) { return <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />{label}</label>; }
