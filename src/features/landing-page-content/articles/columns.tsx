import { Chip } from "@heroui/react";
import { ColumnTable } from "@components/table/types";
import { IArticle } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { ARTICLE_STATUS_META } from "./constant";

export const columnsArticle: ColumnTable<IArticle>[] = [
  {
    key: "title",
    title: "Title",
    render: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-semibold text-foreground">{item.title}</span>
        <span className="text-xs text-muted-foreground">{item.slug}</span>
      </div>
    ),
  },
  {
    key: "excerpt",
    title: "Excerpt",
    render: (item) => (
      <span className="line-clamp-2 max-w-xs text-sm text-muted-foreground">
        {item.excerpt}
      </span>
    ),
  },
  {
    key: "status",
    title: "Status",
    render: (item) => {
      const meta = ARTICLE_STATUS_META[item.status] ?? ARTICLE_STATUS_META.draft;
      return <Chip size="sm" color={meta.color} variant="soft">{meta.label}</Chip>;
    },
  },
  {
    key: "viewsCount",
    title: "Views",
    render: (item) => <span className="text-sm">{item.viewsCount ?? 0}</span>,
  },
  {
    key: "sortOrder",
    title: "Order",
  },
  {
    key: "createdAt",
    title: "Created At",
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];
