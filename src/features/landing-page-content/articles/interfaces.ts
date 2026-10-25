export type ArticleStatus = "draft" | "published" | "archived";

export interface IArticle {
  id: string;
  slug: string;
  title: string;
  coverImage?: string | null;
  excerpt: string;
  content: string;
  status: ArticleStatus;
  viewsCount: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string | Date;
}
