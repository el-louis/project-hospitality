import Link from "next/link";
import { OfferingCard } from "./offering-card";
import type { PublicOffering, RedMasaiProfile } from "@/lib/types";

export function IntentionPage({ eyebrow, title, introduction, examples, offerings, profile }: {
  eyebrow: string; title: string; introduction: string; examples: readonly string[]; offerings: PublicOffering[]; profile: RedMasaiProfile;
}) {
  return <main><section className="bg-surface-secondary px-4 py-16 sm:px-6 sm:py-20"><div className="mx-auto max-w-6xl"><p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</p><h1 className="mt-4 max-w-4xl text-4xl font-semibold text-text-primary sm:text-5xl">{title}</h1><p className="mt-5 max-w-3xl text-lg text-text-secondary">{introduction}</p></div></section><section className="px-4 py-16 sm:px-6"><div className="mx-auto max-w-6xl"><h2 className="text-2xl font-semibold text-text-primary">Ideas this path can support</h2><ul className="mt-6 flex flex-wrap gap-3">{examples.map((example) => <li key={example} className="rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">{example}</li>)}</ul><div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{offerings.map((offering) => <OfferingCard key={offering.slug} offering={offering} profile={profile} />)}</div>{!offerings.length ? <p className="mt-10 rounded-2xl border border-dashed border-border p-8 text-text-secondary">No active offerings are currently published for this path.</p> : null}<div className="mt-10"><Link href="/contact" className="inline-flex rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-accent">Start an enquiry</Link></div></div></section></main>;
}
