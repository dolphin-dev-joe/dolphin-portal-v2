const HASHTAG = /#[\p{L}\p{N}_]+/gu;
const TOKEN = /(#[\p{L}\p{N}_]+|@[\w.]+)/u;

export function countHashtags(caption: string): number {
  return caption.match(HASHTAG)?.length ?? 0;
}

/** Splits a caption into plain text and #hashtag / @mention parts for highlighting. */
export function tokenizeCaption(caption: string): { text: string; isTag: boolean }[] {
  return caption
    .split(TOKEN)
    .filter(Boolean)
    .map((text) => ({ text, isTag: TOKEN.test(text) }));
}

const pad = (n: number) => String(n).padStart(2, "0");

/** "Sab, 24 Okt 2026 · 19:00" */
export function formatSchedule(iso: string | null | undefined): string {
  if (!iso) return "-";
  const d = new Date(iso);
  const date = d.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return `${date} · ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Date key "2026-10-24" in local time, used to group posts per calendar day. */
export function dayKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
