import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ColumnTable } from "@components/table/types";
import type { ISocialPost } from "./interfaces";
import { FORMAT_META, PLATFORM_META, STATUS_META } from "./constants";
import { formatSchedule } from "./utils";

export function StatusChip({ status }: { status: ISocialPost["status"] }) {
  const meta = STATUS_META[status] ?? STATUS_META.draft;
  return (
    <Chip size="sm" color={meta.color} variant="soft">
      <Icon icon={meta.icon} className="h-3.5 w-3.5" />
      <Chip.Label>{meta.label}</Chip.Label>
    </Chip>
  );
}

export const columnsSocialPost: ColumnTable<ISocialPost>[] = [
  {
    key: "title",
    title: "Postingan",
    render: (item) => {
      const cover = item.media?.[0]?.url;
      return (
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md border border-divider bg-default-100">
            {cover ? (
              <img src={cover} alt="" className="h-full w-full object-cover" />
            ) : (
              <Icon icon="mdi:image-outline" className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-sm font-semibold text-foreground">{item.title}</span>
            <span className="line-clamp-1 max-w-xs text-xs text-muted-foreground">
              {item.caption || "Belum ada caption"}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    key: "format",
    title: "Format",
    render: (item) => {
      const platform = PLATFORM_META[item.platform] ?? PLATFORM_META.instagram;
      const format = FORMAT_META[item.format] ?? FORMAT_META.feed;
      return (
        <div className="flex items-center gap-1.5 text-sm">
          <Icon icon={platform.icon} className="h-4 w-4" />
          <span>{format.label}</span>
          {item.media?.length > 1 && (
            <span className="text-xs text-muted-foreground">· {item.media.length} slide</span>
          )}
        </div>
      );
    },
  },
  {
    key: "status",
    title: "Status",
    render: (item) => <StatusChip status={item.status} />,
  },
  {
    key: "scheduledAt",
    title: "Jadwal",
    render: (item) => (
      <span className="text-sm">
        {item.status === "posted" ? formatSchedule(item.postedAt) : formatSchedule(item.scheduledAt)}
      </span>
    ),
  },
];
