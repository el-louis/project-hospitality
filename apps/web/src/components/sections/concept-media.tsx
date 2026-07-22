"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getRedMasaiMedia,
  RED_MASAI_DEMO_MEDIA_ENABLED,
  type RedMasaiMediaKey,
} from "@/lib/red-masai-media";
import { MediaPlaceholder } from "./media-placeholder";

type SharedProps = {
  mediaKey: RedMasaiMediaKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  caption?: string;
};

const placeholderKind = {
  stay: "stay",
  experience: "experience",
  celebrate: "celebrate",
  create: "create",
} as const;

export function ConceptImage(props: SharedProps) {
  const media = getRedMasaiMedia(props.mediaKey);
  const [unavailable, setUnavailable] = useState(false);
  const enabled = RED_MASAI_DEMO_MEDIA_ENABLED && media.type === "image";
  const className = `concept-media ${props.className ?? ""}`;

  return (
    <figure className={className} style={{ aspectRatio: media.aspectRatio }}>
      {enabled && !unavailable ? (
        <Image
          src={media.src}
          alt={props.decorative ? "" : media.alt}
          fill
          sizes={props.sizes ?? "(max-width: 768px) 100vw, 50vw"}
          preload={Boolean(props.priority)}
          loading={props.priority ? "eager" : "lazy"}
          style={{ objectFit: "cover", objectPosition: media.objectPosition }}
          onError={() => setUnavailable(true)}
        />
      ) : (
        <MediaPlaceholder
          kind={placeholderKind[media.category]}
          label={media.fallbackLabel}
          className="absolute inset-0"
        />
      )}
      {props.caption ? (
        <figcaption className="concept-media-caption">{props.caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function ConceptVideo({
  mediaKey,
  posterKey,
  className = "",
  caption,
}: SharedProps & { posterKey: RedMasaiMediaKey }) {
  const media = getRedMasaiMedia(mediaKey);
  const poster = getRedMasaiMedia(posterKey);
  const [unavailable, setUnavailable] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const enabled = RED_MASAI_DEMO_MEDIA_ENABLED && media.type === "video";

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const posterProbe = new window.Image();
    posterProbe.onerror = () => setUnavailable(true);
    posterProbe.src = poster.src;
    return () => {
      posterProbe.onerror = null;
    };
  }, [enabled, poster.src]);

  return (
    <figure
      className={`concept-media concept-video ${className}`}
      style={{ aspectRatio: media.aspectRatio }}
    >
      {enabled && !unavailable ? (
        <video
          aria-label={media.alt}
          controls
          controlsList="nodownload noplaybackrate"
          disablePictureInPicture
          muted
          playsInline
          preload={reducedMotion ? "none" : "metadata"}
          poster={poster.src}
          onError={() => setUnavailable(true)}
        >
          <source src={media.src} type="video/mp4" />
        </video>
      ) : (
        <MediaPlaceholder
          kind="create"
          label={media.fallbackLabel}
          className="absolute inset-0"
        />
      )}
      {caption ? (
        <figcaption className="concept-media-caption">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

export function ConceptMedia(props: SharedProps) {
  const media = getRedMasaiMedia(props.mediaKey);
  return media.type === "video" ? (
    <ConceptVideo
      {...props}
      posterKey="createEventPreparationPoster"
    />
  ) : (
    <ConceptImage {...props} />
  );
}
