import { IntentionPage } from "@/components/sections/intention-page";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import {
  fetchOfferings,
  fetchPublicFeatures,
  fetchRedMasaiProfile,
} from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Experiences",
  description:
    "Explore Red Masai cinema-style, garden and private-leisure concept offerings.",
};
export default async function ExperiencesPage() {
  const [profile, offerings, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchOfferings("EXPERIENCE").catch(() => []),
    fetchPublicFeatures().catch(() => null),
  ]);
  if (!profile) return <PublicDataUnavailable />;
  return (
    <IntentionPage
      eyebrow="Experience"
      title="Private leisure, garden time and shared moments"
      introduction="Browse concept experiences and ask the team to confirm current pricing, capacity, session times and inclusions before making plans."
      examples={[
        "Private cinema",
        "Romantic moments",
        "Garden picnics",
        "Couple dinners",
        "Games",
        "Cycling",
        "Private leisure",
      ]}
      offerings={offerings}
      profile={profile}
      whatsappEnabled={Boolean(features?.whatsappContact)}
    />
  );
}
