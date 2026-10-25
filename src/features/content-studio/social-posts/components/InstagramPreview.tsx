import { useEffect, useState } from "react";
import { cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import {
  BRAND_AVATAR,
  BRAND_HANDLE,
  CAPTION_FOLD,
  FORMAT_META,
} from "../constants";
import type { ISocialMedia, SocialFormat } from "../interfaces";
import { tokenizeCaption } from "../utils";

interface InstagramPreviewProps {
  media: ISocialMedia[];
  caption: string;
  format: SocialFormat;
  /** Date shown under the caption; defaults to today. */
  date?: string | null;
  className?: string;
}

function Caption({ caption }: { caption: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = caption.length > CAPTION_FOLD;
  const shown = expanded || !isLong ? caption : caption.slice(0, CAPTION_FOLD).trimEnd();

  if (!caption.trim()) {
    return <span className="text-muted-foreground italic">Caption masih kosong…</span>;
  }

  return (
    <span className="whitespace-pre-wrap break-words">
      <span className="mr-1 font-semibold">{BRAND_HANDLE}</span>
      {tokenizeCaption(shown).map((part, i) =>
        part.isTag ? (
          <span key={i} className="text-accent">
            {part.text}
          </span>
        ) : (
          <span key={i}>{part.text}</span>
        ),
      )}
      {isLong && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="ml-1 text-muted-foreground"
        >
          … more
        </button>
      )}
    </span>
  );
}

/**
 * A rough Instagram look-alike, so staff can check the post before posting
 * it by hand. Not pixel-perfect on purpose.
 */
export function InstagramPreview({
  media,
  caption,
  format,
  date,
  className,
}: InstagramPreviewProps) {
  const [index, setIndex] = useState(0);
  const slides = media.filter((m) => m.url);
  const count = slides.length;
  const meta = FORMAT_META[format] ?? FORMAT_META.feed;
  const isVertical = format === "story" || format === "reel";

  // Keep the index valid when slides are removed while editing.
  useEffect(() => {
    if (index > 0 && index >= count) setIndex(Math.max(0, count - 1));
  }, [count, index]);

  const current = slides[index];
  const dateLabel = new Date(date ?? Date.now()).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
  });

  const avatar = (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-warning via-danger to-accent p-0.5">
      <span className="flex h-full w-full items-center justify-center rounded-full bg-surface">
        <img src={BRAND_AVATAR} alt="" className="h-5 w-5 object-contain" />
      </span>
    </span>
  );

  const mediaArea = (
    <div className={cn("relative w-full overflow-hidden bg-default-100", meta.aspect)}>
      {current ? (
        <img
          src={current.url}
          alt={current.alt || `Slide ${index + 1}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
          <Icon icon={meta.icon} className="h-10 w-10" />
          <span className="text-sm font-medium">Belum ada gambar</span>
          <span className="text-xs">{meta.size} px</span>
        </div>
      )}

      {count > 1 && (
        <>
          <span className="absolute top-3 right-3 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
            {index + 1}/{count}
          </span>
          {index > 0 && (
            <button
              type="button"
              aria-label="Slide sebelumnya"
              onClick={() => setIndex((i) => i - 1)}
              className="absolute top-1/2 left-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-foreground shadow"
            >
              <Icon icon="mdi:chevron-left" className="h-5 w-5" />
            </button>
          )}
          {index < count - 1 && (
            <button
              type="button"
              aria-label="Slide berikutnya"
              onClick={() => setIndex((i) => i + 1)}
              className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-foreground shadow"
            >
              <Icon icon="mdi:chevron-right" className="h-5 w-5" />
            </button>
          )}
        </>
      )}

      {isVertical && (
        <div className="absolute inset-x-0 top-0 bg-linear-to-b from-black/50 to-transparent p-3">
          {format === "story" && count > 0 && (
            <div className="mb-2 flex gap-1">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={cn("h-0.5 flex-1 rounded-full", i <= index ? "bg-white" : "bg-white/40")}
                />
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 text-sm font-semibold text-white">
            {avatar}
            {BRAND_HANDLE}
          </div>
        </div>
      )}

      {format === "reel" && (
        <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent p-3 text-sm text-white">
          <div className="line-clamp-2">{caption || "Caption reel…"}</div>
        </div>
      )}
    </div>
  );

  if (isVertical) {
    return (
      <div className={cn("mx-auto w-full max-w-xs overflow-hidden rounded-3xl border border-divider bg-surface shadow-md", className)}>
        {mediaArea}
      </div>
    );
  }

  return (
    <div className={cn("mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-divider bg-surface text-sm shadow-md", className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5">
        {avatar}
        <span className="flex-1 font-semibold">{BRAND_HANDLE}</span>
        <Icon icon="mdi:dots-horizontal" className="h-5 w-5" />
      </div>

      {mediaArea}

      {/* Actions */}
      <div className="relative flex items-center gap-3.5 px-3 pt-2.5 pb-1">
        <Icon icon="mdi:heart-outline" className="h-6 w-6" />
        <Icon icon="mdi:chat-outline" className="h-6 w-6" />
        <Icon icon="mdi:send-outline" className="h-6 w-6 -rotate-12" />
        {count > 1 && (
          <div className="absolute left-1/2 flex -translate-x-1/2 gap-1">
            {slides.map((_, i) => (
              <span
                key={i}
                className={cn("h-1.5 w-1.5 rounded-full", i === index ? "bg-accent" : "bg-default-300")}
              />
            ))}
          </div>
        )}
        <Icon icon="mdi:bookmark-outline" className="ml-auto h-6 w-6" />
      </div>

      {/* Caption */}
      <div className="space-y-1 px-3 pt-1 pb-3">
        <div className="font-semibold">0 suka</div>
        <Caption caption={caption} />
        <div className="text-xs text-muted-foreground uppercase">{dateLabel}</div>
      </div>
    </div>
  );
}
