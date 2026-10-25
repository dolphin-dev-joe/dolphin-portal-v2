import { useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import { Link, useNavigate } from "react-router";
import { Button, Card, Skeleton, Typography, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import type { ISocialPost } from "@features/content-studio/social-posts/interfaces";
import { FORMAT_META, STATUS_META } from "@features/content-studio/social-posts/constants";
import { dayKey } from "@features/content-studio/social-posts/utils";

const WEEKDAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

const STATUS_DOT: Record<ISocialPost["status"], string> = {
  idea: "bg-default-400",
  draft: "bg-warning",
  review: "bg-accent",
  ready: "bg-success",
  posted: "bg-success",
};

/** Monday-first grid of 6 weeks covering the given month. */
function monthGrid(month: Date): Date[] {
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const offset = (first.getDay() + 6) % 7; // Monday = 0
  const start = new Date(first);
  start.setDate(first.getDate() - offset);
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function timeOf(iso: string) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function PostPill({ post }: { post: ISocialPost }) {
  const cover = post.media?.[0]?.url;
  return (
    <Link
      to={`/social-posts/show/${post.id}`}
      title={`${post.title} — ${STATUS_META[post.status]?.label ?? post.status}`}
      className="flex items-center gap-1.5 rounded-md border border-divider bg-surface px-1.5 py-1 text-xs transition-colors hover:border-accent"
    >
      {cover ? (
        <img src={cover} alt="" className="h-5 w-4 shrink-0 rounded-sm object-cover" />
      ) : (
        <Icon icon={FORMAT_META[post.format]?.icon ?? "mdi:image-outline"} className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT[post.status])} />
      <span className="truncate">{post.title}</span>
      {post.scheduledAt && (
        <span className="ml-auto shrink-0 text-muted-foreground">{timeOf(post.scheduledAt)}</span>
      )}
    </Link>
  );
}

export default function ContentCalendarPage() {
  const navigate = useNavigate();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const days = useMemo(() => monthGrid(month), [month]);
  const todayKey = dayKey(new Date());

  const { result, query } = useList<ISocialPost>({
    resource: "social-posts",
    filters: [
      { field: "scheduledFrom", operator: "eq", value: dayKey(days[0]) },
      { field: "scheduledTo", operator: "eq", value: dayKey(days[days.length - 1]) },
    ],
    sorters: [{ field: "scheduledAt", order: "asc" }],
    pagination: { currentPage: 1, pageSize: 500 },
  });

  const byDay = useMemo(() => {
    const map = new Map<string, ISocialPost[]>();
    for (const post of result?.data ?? []) {
      if (!post.scheduledAt) continue;
      const key = dayKey(new Date(post.scheduledAt));
      map.set(key, [...(map.get(key) ?? []), post]);
    }
    return map;
  }, [result?.data]);

  const monthLabel = month.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
  const shiftMonth = (delta: number) =>
    setMonth((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1));
  const createOn = (key: string) => navigate(`/social-posts/create?date=${key}`);

  const inMonthDays = days.filter((d) => d.getMonth() === month.getMonth());

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Typography type="h4">Kalender Konten</Typography>
          <Typography type="body-sm" color="muted">
            Rencana tayang postingan per hari. Klik tanggal untuk membuat postingan baru.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button isIconOnly variant="ghost" aria-label="Bulan sebelumnya" onPress={() => shiftMonth(-1)}>
            <Icon icon="mdi:chevron-left" className="h-5 w-5" />
          </Button>
          <Typography type="body" className="min-w-36 text-center font-semibold capitalize">
            {monthLabel}
          </Typography>
          <Button isIconOnly variant="ghost" aria-label="Bulan berikutnya" onPress={() => shiftMonth(1)}>
            <Icon icon="mdi:chevron-right" className="h-5 w-5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              const now = new Date();
              setMonth(new Date(now.getFullYear(), now.getMonth(), 1));
            }}
          >
            Hari ini
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(["idea", "draft", "review"] as const).map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[s])} />
            {STATUS_META[s].label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className={cn("h-2 w-2 rounded-full", STATUS_DOT.ready)} />
          Siap / Sudah Diposting
        </span>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-150 w-full rounded-2xl" />
      ) : (
        <>
          {/* Desktop: month grid */}
          <Card className="hidden overflow-hidden p-0 md:block">
            <div className="grid grid-cols-7 border-b border-divider bg-default-50">
              {WEEKDAYS.map((d) => (
                <div key={d} className="px-2 py-2 text-center text-xs font-semibold text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {days.map((d) => {
                const key = dayKey(d);
                const posts = byDay.get(key) ?? [];
                const inMonth = d.getMonth() === month.getMonth();
                return (
                  <div
                    key={key}
                    className={cn(
                      "group flex min-h-32 flex-col gap-1 border-r border-b border-divider p-1.5 [&:nth-child(7n)]:border-r-0",
                      !inMonth && "bg-default-50/60",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-xs",
                          key === todayKey
                            ? "bg-accent font-semibold text-accent-foreground"
                            : inMonth
                              ? "text-foreground"
                              : "text-muted-foreground/60",
                        )}
                      >
                        {d.getDate()}
                      </span>
                      <button
                        type="button"
                        aria-label={`Buat postingan tanggal ${key}`}
                        onClick={() => createOn(key)}
                        className="rounded p-0.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-accent"
                      >
                        <Icon icon="mdi:plus" className="h-4 w-4" />
                      </button>
                    </div>
                    {posts.slice(0, 3).map((p) => (
                      <PostPill key={p.id} post={p} />
                    ))}
                    {posts.length > 3 && (
                      <span className="px-1 text-xs text-muted-foreground">+{posts.length - 3} lagi</span>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Mobile: agenda list */}
          <div className="flex flex-col gap-3 md:hidden">
            {inMonthDays.filter((d) => byDay.has(dayKey(d))).length === 0 && (
              <Card>
                <Card.Content className="py-10 text-center">
                  <Typography type="body-sm" color="muted">
                    Belum ada postingan terjadwal bulan ini.
                  </Typography>
                </Card.Content>
              </Card>
            )}
            {inMonthDays
              .filter((d) => byDay.has(dayKey(d)))
              .map((d) => (
                <div key={dayKey(d)} className="flex flex-col gap-1.5">
                  <Typography type="body-xs" color="muted" className="font-semibold uppercase">
                    {d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short" })}
                  </Typography>
                  {byDay.get(dayKey(d))!.map((p) => (
                    <PostPill key={p.id} post={p} />
                  ))}
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
