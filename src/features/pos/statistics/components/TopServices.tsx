import { Typography } from "@heroui/react";
import type { ServiceStat } from "../interfaces";
import { formatNumber, formatRupiah } from "../format";

/** Rows shown before the tail folds into "Lainnya". */
export const TOP_SERVICES = 6;

export interface ServiceRow {
  key: string;
  name: string;
  revenue: number;
  orders: number;
  detail: string;
}

/** Top services by revenue plus one "Lainnya" row for the rest. */
export function serviceRows(data: ServiceStat[]): ServiceRow[] {
  const top = data.slice(0, TOP_SERVICES).map((s) => ({
    key: s.serviceName,
    name: s.serviceName,
    revenue: s.revenue,
    orders: s.orders,
    detail: `${formatNumber(s.quantity)}${s.unit ? ` ${s.unit}` : ""} · ${formatNumber(s.orders)} order`,
  }));
  const rest = data.slice(TOP_SERVICES);
  if (rest.length > 0) {
    top.push({
      key: "__other",
      name: `Lainnya (${rest.length} layanan)`,
      revenue: rest.reduce((sum, s) => sum + s.revenue, 0),
      orders: rest.reduce((sum, s) => sum + s.orders, 0),
      detail: "Gabungan layanan di luar daftar teratas",
    });
  }
  return top;
}

/**
 * Ranked horizontal bars, one hue, largest first. Each value is printed at
 * the row's end, so nothing depends on hovering.
 */
export default function TopServices({ data }: { data: ServiceStat[] }) {
  const rows = serviceRows(data);
  const max = Math.max(0, ...rows.map((r) => r.revenue));

  if (rows.length === 0 || max <= 0) {
    return (
      <Typography type="body-sm" color="muted" className="py-6 text-center">
        Belum ada layanan terjual pada periode ini.
      </Typography>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {rows.map((row) => (
        <li key={row.key} className="min-w-0">
          <div className="flex items-baseline justify-between gap-3">
            <span className="min-w-0 truncate text-sm font-medium text-foreground" title={row.name}>
              {row.name}
            </span>
            <span className="shrink-0 text-sm font-semibold text-foreground tabular-nums">
              {formatRupiah(row.revenue)}
            </span>
          </div>
          <div className="mt-1 h-2.5 w-full" aria-hidden>
            <div
              className="h-full min-w-0.5 rounded-e-sm"
              style={{
                width: `${(row.revenue / max) * 100}%`,
                background: row.key === "__other" ? "var(--chart-other)" : "var(--chart-1)",
              }}
            />
          </div>
          <div className="mt-0.5 truncate text-xs text-muted">{row.detail}</div>
        </li>
      ))}
    </ol>
  );
}
