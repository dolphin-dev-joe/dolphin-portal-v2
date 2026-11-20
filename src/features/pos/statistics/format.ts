import type { Granularity } from "./interfaces";

const rupiah = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 });
const compact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const number = new Intl.NumberFormat("id-ID", { maximumFractionDigits: 1 });

/** Rp 205.700 (rounded to the rupiah). */
export function formatRupiah(value: number) {
  return `Rp ${rupiah.format(Math.round(value))}`;
}

/** Full value up to Rp 10 jt, compact above it (Rp 12,5 jt) so tiles never overflow. */
export function formatRupiahTile(value: number) {
  return Math.abs(value) >= 10_000_000 ? `Rp ${compact.format(value)}` : formatRupiah(value);
}

/** Axis ticks: 0 / 50 rb / 1,2 jt. */
export function formatCompact(value: number) {
  return compact.format(value);
}

export function formatNumber(value: number) {
  return number.format(value);
}

// "YYYY-MM-DD" as a local calendar date (new Date("2026-11-20") would be UTC).
export function parseDay(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

const dayShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const dayLong = new Intl.DateTimeFormat("id-ID", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
});
const monthShort = new Intl.DateTimeFormat("id-ID", { month: "short", year: "2-digit" });
const monthLong = new Intl.DateTimeFormat("id-ID", { month: "long", year: "numeric" });
const rangeDay = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

/** Short x-axis label of a trend bucket. */
export function formatBucketTick(date: string, g: Granularity) {
  const d = parseDay(date);
  return g === "month" ? monthShort.format(d) : dayShort.format(d);
}

/** Full label of a trend bucket, for tooltips and tables. */
export function formatBucketLabel(date: string, g: Granularity) {
  const d = parseDay(date);
  if (g === "month") return monthLong.format(d);
  if (g === "week") {
    const end = new Date(d);
    end.setDate(d.getDate() + 6);
    return `${dayShort.format(d)} – ${rangeDay.format(end)}`;
  }
  return dayLong.format(d);
}

/** 22 Okt 2026 – 20 Nov 2026 */
export function formatRange(from: string, to: string) {
  return `${rangeDay.format(parseDay(from))} – ${rangeDay.format(parseDay(to))}`;
}

export const PAYMENT_LABELS: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

/** Fixed per method (the entity), never by rank, so a method keeps its color. */
export const PAYMENT_COLORS: Record<string, string> = {
  cash: "var(--chart-1)",
  transfer: "var(--chart-2)",
  qris: "var(--chart-3)",
};

export const WEEKDAYS = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

/** "09.00–10.00" */
export function formatHourSlot(hour: number) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hour)}.00–${pad((hour + 1) % 24)}.00`;
}
