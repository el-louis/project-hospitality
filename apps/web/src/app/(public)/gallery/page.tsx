import { MediaPlaceholder } from "@/components/sections/media-placeholder";

export const metadata = {
  title: "Gallery Preview",
  description: "Media spaces awaiting owner-approved Red Masai photography.",
};

export default function GalleryPage() {
  const slots = [
    ["stay", "Apartment photography"],
    ["experience", "Garden photography"],
    ["cinema", "Cinema photography"],
    ["celebrate", "Celebration photography"],
    ["create", "Creative-shoot photography"],
    ["location", "Exterior photography"],
  ] as const;
  return (
    <main className="px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary">
          Gallery preview
        </p>
        <h1 className="mt-4 text-5xl font-semibold text-text-primary sm:text-6xl">
          A place for the real Red Masai story
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-text-secondary">
          No social-media photographs have been copied into this prototype.
          These slots show the owner-approved media still needed.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map(([kind, label]) => (
            <MediaPlaceholder
              key={label}
              kind={kind}
              label={label}
              className="aspect-[4/3] rounded-3xl"
            />
          ))}
        </div>
      </div>
    </main>
  );
}
