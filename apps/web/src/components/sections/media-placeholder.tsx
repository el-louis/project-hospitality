import {
  Camera,
  Clapperboard,
  Flower2,
  Home,
  MapPin,
  PartyPopper,
} from "lucide-react";

const icons = {
  stay: Home,
  celebrate: PartyPopper,
  experience: Flower2,
  cinema: Clapperboard,
  create: Camera,
  location: MapPin,
} as const;

export function MediaPlaceholder({
  kind,
  label,
  className = "aspect-[4/3]",
}: {
  kind: keyof typeof icons;
  label: string;
  className?: string;
}) {
  const Icon = icons[kind];
  return (
    <div
      className={`concept-grid relative isolate flex overflow-hidden bg-surface-secondary ${className}`}
      role="img"
      aria-label={`${label}. Owner-approved photography pending.`}
    >
      <div
        className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-secondary/45"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-14 -left-10 h-36 w-36 rounded-full bg-primary/10"
        aria-hidden="true"
      />
      <div className="relative m-auto flex max-w-56 flex-col items-center px-6 text-center">
        <span
          className="grid h-12 w-12 place-items-center rounded-full bg-surface text-primary shadow-sm"
          aria-hidden="true"
        >
          <Icon size={22} strokeWidth={1.7} />
        </span>
        <span className="mt-4 text-sm font-semibold text-text-primary">
          {label}
        </span>
        <span className="mt-1 text-xs text-text-secondary">
          Owner-approved image to follow
        </span>
      </div>
    </div>
  );
}
