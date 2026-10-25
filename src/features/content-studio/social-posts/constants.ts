import type { SocialFormat, SocialPlatform, SocialPostStatus } from "./interfaces";

/** Account shown in the post preview. */
export const BRAND_HANDLE = "dolphinlaundry";
export const BRAND_AVATAR = "/assets/images/dl-logo.png";

// Instagram limits, used for warnings in the caption editor.
export const CAPTION_MAX = 2200;
export const HASHTAG_MAX = 30;
/** Instagram cuts the caption after about this many characters ("… more"). */
export const CAPTION_FOLD = 125;

/** Hashtags added by the "hashtag standar" button. Edit freely. */
export const HASHTAG_PRESET =
  "#dolphinlaundry #laundrykupang #kupang #laundry #drycleaning #laundryantarjemput";

/** Where "Buat desain di Canva" leads when a post has no design link yet. */
export const CANVA_NEW_DESIGN_URL = "https://www.canva.com/create/instagram-posts/";

export const PLATFORM_OPTIONS: { id: SocialPlatform; label: string }[] = [
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "facebook", label: "Facebook" },
];

export const PLATFORM_META: Record<SocialPlatform, { label: string; icon: string }> = {
  instagram: { label: "Instagram", icon: "mdi:instagram" },
  tiktok: { label: "TikTok", icon: "ic:baseline-tiktok" },
  facebook: { label: "Facebook", icon: "mdi:facebook" },
};

export const FORMAT_OPTIONS: { id: SocialFormat; label: string }[] = [
  { id: "feed", label: "Feed (1 gambar)" },
  { id: "carousel", label: "Carousel (banyak slide)" },
  { id: "reel", label: "Reel" },
  { id: "story", label: "Story" },
];

export const FORMAT_META: Record<
  SocialFormat,
  { label: string; icon: string; aspect: string; size: string }
> = {
  feed: { label: "Feed", icon: "mdi:image-outline", aspect: "aspect-4/5", size: "1080 × 1350" },
  carousel: { label: "Carousel", icon: "mdi:view-carousel-outline", aspect: "aspect-4/5", size: "1080 × 1350" },
  reel: { label: "Reel", icon: "mdi:movie-open-outline", aspect: "aspect-9/16", size: "1080 × 1920" },
  story: { label: "Story", icon: "mdi:cellphone", aspect: "aspect-9/16", size: "1080 × 1920" },
};

/** Workflow order: idea → draft → review → ready → posted. */
export const STATUS_OPTIONS: { id: SocialPostStatus; label: string }[] = [
  { id: "idea", label: "Ide" },
  { id: "draft", label: "Draft" },
  { id: "review", label: "Review" },
  { id: "ready", label: "Siap Posting" },
  { id: "posted", label: "Sudah Diposting" },
];

export const STATUS_META: Record<
  SocialPostStatus,
  { label: string; color: "default" | "warning" | "accent" | "success" | "danger"; icon: string }
> = {
  idea: { label: "Ide", color: "default", icon: "mdi:lightbulb-outline" },
  draft: { label: "Draft", color: "warning", icon: "mdi:pencil-outline" },
  review: { label: "Review", color: "accent", icon: "mdi:eye-check-outline" },
  ready: { label: "Siap Posting", color: "success", icon: "mdi:check-circle-outline" },
  posted: { label: "Sudah Diposting", color: "success", icon: "mdi:send-check-outline" },
};

/** The next step offered as a one-click button on the detail page. */
export const NEXT_STEP: Partial<
  Record<SocialPostStatus, { to: SocialPostStatus; label: string; icon: string }>
> = {
  idea: { to: "draft", label: "Mulai Kerjakan", icon: "mdi:pencil-outline" },
  draft: { to: "review", label: "Ajukan Review", icon: "mdi:send-outline" },
  review: { to: "ready", label: "Setujui", icon: "mdi:check" },
  ready: { to: "posted", label: "Tandai Sudah Diposting", icon: "mdi:send-check-outline" },
};
