import type { ArticleStatus } from "./interfaces";

export const ARTICLE_STATUS_OPTIONS: { id: ArticleStatus; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "published", label: "Published" },
  { id: "archived", label: "Archived" },
];

export const ARTICLE_STATUS_META: Record<
  ArticleStatus,
  { color: "warning" | "success" | "default"; label: string }
> = {
  draft: { color: "warning", label: "Draft" },
  published: { color: "success", label: "Published" },
  archived: { color: "default", label: "Archived" },
};
