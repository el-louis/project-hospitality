import { IntentionPage } from "@/components/sections/intention-page";
import { PublicDataUnavailable } from "@/components/sections/public-data-unavailable";
import {
  fetchOfferings,
  fetchPublicFeatures,
  fetchRedMasaiProfile,
} from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Create",
  description:
    "Explore Red Masai spaces for photography, video and content-production enquiries.",
};
export default async function CreatePage() {
  const [profile, offerings, features] = await Promise.all([
    fetchRedMasaiProfile().catch(() => null),
    fetchOfferings("CREATE").catch(() => []),
    fetchPublicFeatures().catch(() => null),
  ]);
  if (!profile) return <PublicDataUnavailable />;
  return (
    <IntentionPage
      eyebrow="Create"
      title="A private setting for your next production"
      introduction="Share your production needs so Red Masai can confirm suitable indoor or outdoor spaces, timing, crew limits, equipment rules and pricing."
      examples={[
        "Video shoots",
        "Photography",
        "Social-media content",
        "Product shoots",
        "Interviews",
        "Music productions",
        "Lifestyle productions",
      ]}
      offerings={offerings}
      profile={profile}
      whatsappEnabled={Boolean(features?.whatsappContact)}
    />
  );
}
