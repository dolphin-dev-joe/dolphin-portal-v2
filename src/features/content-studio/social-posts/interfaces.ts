export type SocialPlatform = "instagram" | "tiktok" | "facebook";
export type SocialFormat = "feed" | "carousel" | "reel" | "story";
export type SocialPostStatus = "idea" | "draft" | "review" | "ready" | "posted";

/** One image of a post, in slide order. */
export interface ISocialMedia {
  url: string;
  alt?: string;
}

export interface ISocialPost {
  id: string;
  /** Internal name, never shown on the platform. */
  title: string;
  platform: SocialPlatform;
  format: SocialFormat;
  caption: string;
  media: ISocialMedia[];
  canvaUrl: string | null;
  status: SocialPostStatus;
  /** ISO date-time. */
  scheduledAt: string | null;
  postedAt: string | null;
  /** Link to the live post, filled in by hand after posting. */
  postUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}
