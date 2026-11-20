import { Typography } from "@heroui/react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import type { HourCell } from "../interfaces";
import { formatHourSlot, formatNumber, WEEKDAYS } from "../format";

const BINS = 5;
// Hours always shown, so a quiet range still reads as a working day.
const OPEN_FROM = 7;
const OPEN_TO = 21;

export function hourBounds(cells: HourCell[]) {
  const hours = cells.map((c) => c.hour);
  return {
    from: Math.min(OPEN_FROM, ...hours),
    to: Math.max(OPEN_TO, ...hours),
  };
}

/** Busiest weekday × hour first (ties: earlier in the week, earlier hour). */
export function busiest(cells: HourCell[]) {
  return [...cells].sort((a, b) => b.orders - a.orders || a.weekday - b.weekday || a.hour - b.hour);
}

const describe = (weekday: number, hour: number, orders: number) =>
  `${WEEKDAYS[weekday - 1]}, ${formatHourSlot(hour)} · ${formatNumber(orders)} order`;

/**
 * Orders per weekday × hour (store time), one hue light → dark. Hover or
 * focus a cell (arrow keys move between cells) to read it in the line above.
 */
export default function PeakHours({ data }: { data: HourCell[] }) {
  const { from, to } = hourBounds(data);
  const hours = useMemo(() => Array.from({ length: to - from + 1 }, (_, i) => from + i), [from, to]);
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of data) m.set(`${c.weekday}-${c.hour}`, c.orders);
    return m;
  }, [data]);
  const max = Math.max(0, ...data.map((c) => c.orders));
  const top = busiest(data)[0];

  const [active, setActive] = useState<{ weekday: number; hour: number } | null>(null);
  const [focusState, setFocus] = useState<{ weekday: number; hour: number } | null>(null);
  const cellRefs = useRef(new Map<string, HTMLDivElement>());
  // Exactly one cell is in the tab order; after the range changes the old
  // one may be off the grid, so fall back to the busiest cell.
  const focus =
    focusState && focusState.hour >= from && focusState.hour <= to
      ? focusState
      : { weekday: top?.weekday ?? 1, hour: top?.hour ?? from };

  if (max === 0) {
    return (
      <Typography type="body-sm" color="muted" className="py-6 text-center">
        Belum ada order pada periode ini.
      </Typography>
    );
  }

  const count = (weekday: number, hour: number) => counts.get(`${weekday}-${hour}`) ?? 0;
  const fill = (n: number) =>
    n === 0 ? "var(--chart-empty)" : `var(--chart-seq-${Math.min(BINS, Math.ceil((n / max) * BINS))})`;

  const move = (e: KeyboardEvent, weekday: number, hour: number) => {
    const step: Record<string, [number, number]> = {
      ArrowUp: [-1, 0],
      ArrowDown: [1, 0],
      ArrowLeft: [0, -1],
      ArrowRight: [0, 1],
    };
    const d = step[e.key];
    if (!d) return;
    e.preventDefault();
    const next = {
      weekday: Math.min(7, Math.max(1, weekday + d[0])),
      hour: Math.min(to, Math.max(from, hour + d[1])),
    };
    setFocus(next);
    cellRefs.current.get(`${next.weekday}-${next.hour}`)?.focus();
  };

  const readout = active
    ? describe(active.weekday, active.hour, count(active.weekday, active.hour))
    : top
    ? `Paling sibuk: ${describe(top.weekday, top.hour, top.orders)}`
    : "";

  const columns = { gridTemplateColumns: `2.75rem repeat(${hours.length}, minmax(0, 1fr))` };

  return (
    <div className="flex flex-col gap-3">
      <div aria-live="polite" className="min-h-5 text-sm font-medium text-foreground">
        {readout}
      </div>

      <div className="overflow-x-auto">
        <div
          role="grid"
          aria-label="Jumlah order per hari dan jam"
          className="flex min-w-md flex-col gap-0.5"
        >
          <div role="row" className="grid gap-0.5" style={columns}>
            <span role="columnheader" />
            {hours.map((h) => (
              <span
                key={h}
                role="columnheader"
                aria-label={formatHourSlot(h)}
                className="text-center text-xs text-muted tabular-nums"
              >
                {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
              </span>
            ))}
          </div>

          {WEEKDAYS.map((name, i) => {
            const weekday = i + 1;
            return (
              <div key={name} role="row" className="grid gap-0.5" style={columns}>
                <span role="rowheader" className="self-center text-xs text-muted">
                  {name.slice(0, 3)}
                </span>
                {hours.map((hour) => {
                  const n = count(weekday, hour);
                  const isFocus = focus.weekday === weekday && focus.hour === hour;
                  const isActive = active?.weekday === weekday && active.hour === hour;
                  return (
                    <div
                      key={hour}
                      ref={(el) => {
                        const key = `${weekday}-${hour}`;
                        if (el) cellRefs.current.set(key, el);
                        else cellRefs.current.delete(key);
                      }}
                      role="gridcell"
                      tabIndex={isFocus ? 0 : -1}
                      aria-label={describe(weekday, hour, n)}
                      onPointerEnter={() => setActive({ weekday, hour })}
                      onPointerLeave={() => setActive(null)}
                      onFocus={() => {
                        setFocus({ weekday, hour });
                        setActive({ weekday, hour });
                      }}
                      onBlur={() => setActive(null)}
                      onKeyDown={(e) => move(e, weekday, hour)}
                      className="h-6 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-focus sm:h-7"
                      style={{
                        background: fill(n),
                        boxShadow: isActive ? "inset 0 0 0 2px var(--foreground)" : undefined,
                      }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span aria-hidden className="size-3 rounded-sm bg-(--chart-empty)" />
          Tidak ada
        </span>
        <span className="flex items-center gap-1.5">
          Sedikit
          <span aria-hidden className="flex gap-0.5">
            {Array.from({ length: BINS }, (_, i) => (
              <span
                key={i}
                className="size-3 rounded-sm"
                style={{ background: `var(--chart-seq-${i + 1})` }}
              />
            ))}
          </span>
          Banyak (maks. {formatNumber(max)} order)
        </span>
      </div>
    </div>
  );
}
