import { Button, Typography, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "@components/inputs/TextInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { SelectInput } from "@components/inputs/SelectInput";
import { DateTimeInput } from "@components/inputs/DateTimeInput";
import { useFormMode } from "@/contexts/FormModeContext";
import { useCopyToClipboard } from "@hooks/useCopyToClipboard";
import { InstagramPreview } from "../components/InstagramPreview";
import { MediaInput } from "../components/MediaInput";
import {
  CANVA_NEW_DESIGN_URL,
  CAPTION_MAX,
  FORMAT_META,
  FORMAT_OPTIONS,
  HASHTAG_MAX,
  HASHTAG_PRESET,
  PLATFORM_OPTIONS,
  STATUS_OPTIONS,
} from "../constants";
import type { ISocialMedia, SocialFormat } from "../interfaces";
import { countHashtags } from "../utils";

const URL_RULE = {
  pattern: { value: /^https?:\/\/\S+$/i, message: "Harus berupa link (https://…)" },
};

function SectionTitle({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 flex items-center gap-2 border-b border-divider pb-2 first:mt-2">
      <Icon icon={icon} className="h-4 w-4 text-accent" />
      <Typography type="body-sm" className="font-semibold">
        {children}
      </Typography>
    </div>
  );
}

function CaptionTools() {
  const { isShow } = useFormMode();
  const { watch, setValue } = useFormContext();
  const copy = useCopyToClipboard();
  const caption: string = watch("caption") ?? "";
  const hashtags = countHashtags(caption);

  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-2">
      <span
        className={cn(
          "text-xs",
          hashtags > HASHTAG_MAX ? "font-semibold text-danger" : "text-muted-foreground",
        )}
      >
        {hashtags}/{HASHTAG_MAX} hashtag
      </span>
      <span className="flex-1" />
      {!isShow && (
        <Button
          size="sm"
          variant="ghost"
          onPress={() =>
            setValue("caption", caption.trimEnd() + (caption.trim() ? "\n\n" : "") + HASHTAG_PRESET, {
              shouldDirty: true,
            })
          }
        >
          <Icon icon="mdi:pound" className="h-4 w-4" />
          Hashtag standar
        </Button>
      )}
      <Button size="sm" variant="secondary" isDisabled={!caption} onPress={() => copy(caption, "Caption disalin")}>
        <Icon icon="mdi:content-copy" className="h-4 w-4" />
        Salin caption
      </Button>
    </div>
  );
}

function CanvaLink() {
  const { watch } = useFormContext();
  const url: string | null = watch("canvaUrl");
  const hasLink = !!url && /^https?:\/\//i.test(url);

  return (
    <a
      href={hasLink ? url : CANVA_NEW_DESIGN_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium text-accent hover:underline"
    >
      <Icon icon="simple-icons:canva" className="h-3.5 w-3.5" />
      {hasLink ? "Buka desain di Canva" : "Buat desain baru di Canva"}
      <Icon icon="mdi:open-in-new" className="h-3 w-3" />
    </a>
  );
}

export default function SocialPostForm() {
  const { watch } = useFormContext();
  const format: SocialFormat = watch("format") ?? "feed";
  const media: ISocialMedia[] = watch("media") ?? [];
  const caption: string = watch("caption") ?? "";
  const status = watch("status");
  const scheduledAt: string | null = watch("scheduledAt");
  const postedAt: string | null = watch("postedAt");
  const formatMeta = FORMAT_META[format] ?? FORMAT_META.feed;

  return (
    <div className="grid grid-cols-1 gap-8 py-2 lg:grid-cols-5">
      {/* ── Editor ─────────────────────────────────────────────── */}
      <div className="lg:col-span-3">
        <SectionTitle icon="mdi:information-outline">Info Postingan</SectionTitle>
        <TextInput
          fieldName="title"
          fieldLabel="Judul (internal)"
          placeholder="mis. Promo Jemput Gratis — Oktober"
          description="Hanya untuk tim, tidak tampil di Instagram."
          isRequired
        />
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-3">
          <SelectInput fieldName="platform" fieldLabel="Platform" options={PLATFORM_OPTIONS} isRequired />
          <SelectInput fieldName="format" fieldLabel="Format" options={FORMAT_OPTIONS} isRequired />
          <SelectInput fieldName="status" fieldLabel="Status" options={STATUS_OPTIONS} isRequired />
        </div>

        <SectionTitle icon="mdi:image-multiple-outline">Desain</SectionTitle>
        <MediaInput
          fieldName="media"
          fieldLabel={format === "feed" ? "Gambar" : "Slide / Gambar"}
          hint={`Ukuran disarankan ${formatMeta.size} px (${formatMeta.label}).`}
          maxItems={format === "feed" ? 1 : 20}
        />
        <TextInput
          fieldName="canvaUrl"
          fieldLabel="Link Canva"
          placeholder="https://www.canva.com/design/…"
          description="Simpan link desain supaya tim lain bisa edit dari sumbernya."
          additionalRules={URL_RULE}
          bottomContent={<CanvaLink />}
        />

        <SectionTitle icon="mdi:text-long">Caption</SectionTitle>
        <TextAreaInput
          fieldName="caption"
          fieldLabel="Caption"
          hideLabel
          placeholder={"Tulis caption di sini…\n\nTips: kalimat pertama paling penting, karena Instagram memotong caption setelah ±125 karakter."}
          rows={10}
          maxLength={CAPTION_MAX}
          showCount
          bottomContent={<CaptionTools />}
        />

        <SectionTitle icon="mdi:calendar-clock-outline">Jadwal & Publikasi</SectionTitle>
        <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
          <DateTimeInput
            fieldName="scheduledAt"
            fieldLabel="Rencana tayang"
            description="Muncul di Kalender Konten."
          />
          {status === "posted" && (
            <DateTimeInput fieldName="postedAt" fieldLabel="Diposting pada" description="Kosongkan = waktu simpan." />
          )}
        </div>
        {status === "posted" && (
          <TextInput
            fieldName="postUrl"
            fieldLabel="Link postingan"
            placeholder="https://www.instagram.com/p/…"
            additionalRules={URL_RULE}
          />
        )}
        <TextAreaInput
          fieldName="notes"
          fieldLabel="Catatan tim"
          placeholder="Brief, revisi, atau catatan untuk reviewer."
          rows={3}
        />
      </div>

      {/* ── Live preview ───────────────────────────────────────── */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-4">
          <div className="mb-3 mt-2 flex items-center justify-between">
            <Typography type="body-sm" className="font-semibold">
              Preview
            </Typography>
            <Typography type="body-xs" color="muted">
              Perkiraan tampilan, bukan 100% sama
            </Typography>
          </div>
          <InstagramPreview
            media={media}
            caption={caption}
            format={format}
            date={postedAt ?? scheduledAt}
          />
        </div>
      </div>
    </div>
  );
}
