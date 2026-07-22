import { IntentionPage } from "@/components/sections/intention-page";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchOfferings, fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function CelebratePage() {
  const [profile, offerings] = await Promise.all([fetchRedMasaiProfile().catch(() => null), fetchOfferings("CELEBRATE").catch(() => [])]);
  if (!profile) return <PublicDataUnavailable />;
  return <IntentionPage eyebrow="Celebrate" title="Make a private moment feel like your own" introduction="Explore Red Masai as a setting for intimate celebrations and group moments, then enquire so the team can confirm capacity, timing, setup and rules." examples={["Birthdays", "Engagements", "Anniversaries", "Baby showers", "Bridal showers", "Gender reveals", "Friends’ gatherings", "VICOBA gatherings", "Staff gatherings", "Small corporate events", "Community or religious gatherings"]} offerings={offerings} profile={profile} />;
}
