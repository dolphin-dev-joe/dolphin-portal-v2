import {
  endOfMonth,
  getLocalTimeZone,
  startOfMonth,
  toCalendarDate,
  today,
  type CalendarDate,
  type DateValue,
} from "@internationalized/date";

export type PresetKey = "7d" | "30d" | "90d" | "this-month" | "last-month" | "12m";

export interface DateRange {
  from: string; // YYYY-MM-DD
  to: string;
}

/** Same cap as the API (dolphin-api stats.MaxDays). */
export const MAX_DAYS = 366;

export const PRESETS: { key: PresetKey; label: string }[] = [
  { key: "7d", label: "7 hari" },
  { key: "30d", label: "30 hari" },
  { key: "90d", label: "90 hari" },
  { key: "this-month", label: "Bulan ini" },
  { key: "last-month", label: "Bulan lalu" },
  { key: "12m", label: "12 bulan" },
];

export const DEFAULT_PRESET: PresetKey = "30d";

export function todayDate(): CalendarDate {
  return today(getLocalTimeZone());
}

function toRange(from: CalendarDate, to: CalendarDate): DateRange {
  return { from: from.toString(), to: to.toString() };
}

export function presetRange(key: PresetKey, now: CalendarDate = todayDate()): DateRange {
  switch (key) {
    case "7d":
      return toRange(now.subtract({ days: 6 }), now);
    case "90d":
      return toRange(now.subtract({ days: 89 }), now);
    case "this-month":
      return toRange(startOfMonth(now), now);
    case "last-month": {
      const last = startOfMonth(now).subtract({ months: 1 });
      return toRange(last, endOfMonth(last));
    }
    case "12m":
      // This month plus the 11 before it, whole months, so 12 monthly bars.
      return toRange(startOfMonth(now).subtract({ months: 11 }), now);
    case "30d":
    default:
      return toRange(now.subtract({ days: 29 }), now);
  }
}

/** Inclusive number of days in a custom range. */
export function rangeDays(from: DateValue, to: DateValue) {
  return toCalendarDate(to).compare(toCalendarDate(from)) + 1;
}
