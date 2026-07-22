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
      title="A private setting for lifestyle, food and social content"
      introduction="Share the moment you want to create so Red Masai can confirm suitable indoor or outdoor space, timing, crew limits, house rules and pricing."
      examples={[
        "Video shoots",
        "Photography",
        "Social-media content",
        "Product shoots",
        "Interviews",
        "Food and event content",
        "Lifestyle content",
      ]}
      offerings={offerings}
      profile={profile}
      whatsappEnabled={Boolean(features?.whatsappContact)}
    />
  );
}
