import { IntentionPage } from "@/components/sections/intention-page";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import { fetchOfferings, fetchRedMasaiProfile } from "@/lib/api";

export const dynamic = "force-dynamic";
export default async function CreatePage() {
  const [profile, offerings] = await Promise.all([fetchRedMasaiProfile().catch(() => null), fetchOfferings("CREATE").catch(() => [])]);
  if (!profile) return <PublicDataUnavailable />;
  return <IntentionPage eyebrow="Create" title="A private setting for your next production" introduction="Share your production needs so Red Masai can confirm suitable indoor or outdoor spaces, timing, crew limits, equipment rules and pricing." examples={["Video shoots", "Photography", "Social-media content", "Product shoots", "Interviews", "Music productions", "Lifestyle productions"]} offerings={offerings} profile={profile} />;
}
