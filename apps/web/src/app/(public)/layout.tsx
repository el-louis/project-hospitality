import type { ReactNode } from "react";
import { ConceptPreviewNotice } from "@/components/sections/concept-preview-notice";
import { SiteFooter } from "@/components/sections/site-footer";
import { SiteHeader } from "@/components/sections/site-header";
import { fetchPublicFeatures, fetchRedMasaiProfile } from "@/lib/api";

export default async function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [profile, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchPublicFeatures().catch(() => null),
  ]);

  return (
    <div className="min-h-screen bg-surface text-text-primary">
      {features?.conceptPreview ? (
        <ConceptPreviewNotice notice={profile?.previewNotice} />
      ) : null}
      <SiteHeader
        displayName={profile?.displayName}
        onlineBooking={features?.onlineBooking}
      />
      {children}
      <SiteFooter profile={profile} />
    </div>
  );
}
