import { Typography } from "@heroui/react";
import type { PaymentShare } from "../interfaces";
import { formatNumber, formatRupiah, PAYMENT_COLORS, PAYMENT_LABELS } from "../format";

/**
 * One whole (money received) split by payment method: a thin segmented bar
 * with no text, above rows that carry each method's name and figures.
 */
export default function PaymentMix({ data }: { data: PaymentShare[] }) {
  const total = data.reduce((sum, p) => sum + p.revenue, 0);

  if (total <= 0) {
    return (
      <Typography type="body-sm" color="muted" className="py-6 text-center">
        Belum ada pembayaran pada periode ini.
      </Typography>
    );
  }

  const parts = data
    .filter((p) => p.revenue > 0)
    .map((p) => ({
      ...p,
      label: PAYMENT_LABELS[p.method] ?? p.method,
      color: PAYMENT_COLORS[p.method] ?? "var(--chart-other)",
      share: p.revenue / total,
    }));

  return (
    <div className="flex flex-col gap-4">
      <div
        role="img"
        aria-label={parts.map((p) => `${p.label} ${formatShare(p.share)}`).join(", ")}
        className="flex h-2 w-full gap-0.5"
      >
        {parts.map((p) => (
          <span
            key={p.method}
            title={`${p.label}: ${formatRupiah(p.revenue)} (${formatShare(p.share)})`}
            className="h-full min-w-1 rounded-full"
            style={{ flexGrow: p.revenue, flexBasis: 0, background: p.color }}
          />
        ))}
      </div>

      <ul className="flex flex-col divide-y divide-(--chart-grid)">
        {parts.map((p) => (
          <li key={p.method} className="flex items-center gap-3 py-2 first:pt-0 last:pb-0">
            <span aria-hidden className="size-2.5 shrink-0 rounded-sm" style={{ background: p.color }} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-foreground">{p.label}</div>
              <div className="text-xs text-muted">{formatNumber(p.orders)} transaksi</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-foreground tabular-nums">
                {formatRupiah(p.revenue)}
              </div>
              <div className="text-xs text-muted tabular-nums">{formatShare(p.share)}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function formatShare(share: number) {
  return `${(share * 100).toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`;
}
