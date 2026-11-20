import { Card, Typography } from "@heroui/react";
import { Icon } from "@iconify/react";

interface KpiTileProps {
  label: string;
  value: string;
  current: number;
  previous: number;
  /** e.g. "vs 22 Sep – 21 Okt". */
  comparisonLabel: string;
  footnote?: string;
}

/**
 * Stat tile: label · value · delta vs the previous period. For every metric
 * here up is good, so the delta color follows the direction, and it always
 * comes with an arrow and a sign (never color alone).
 */
export default function KpiTile({
  label,
  value,
  current,
  previous,
  comparisonLabel,
  footnote,
}: KpiTileProps) {
  const delta = describeDelta(current, previous);

  return (
    <Card className="min-w-0">
      <Card.Content className="flex flex-col gap-1.5 p-3 sm:p-4">
        <Typography type="body-sm" color="muted" weight="medium" truncate>
          {label}
        </Typography>
        <span title={value} className="truncate text-xl font-semibold text-foreground sm:text-2xl">
          {value}
        </span>
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs">
          <span className="inline-flex items-center gap-0.5 font-semibold" style={{ color: delta.color }}>
            {delta.icon && <Icon icon={delta.icon} className="size-3.5" aria-hidden />}
            {delta.text}
          </span>
          <span className="truncate text-muted">{comparisonLabel}</span>
        </div>
        {footnote && (
          <Typography type="body-xs" color="muted" truncate>
            {footnote}
          </Typography>
        )}
      </Card.Content>
    </Card>
  );
}

function describeDelta(current: number, previous: number) {
  if (previous === 0) {
    return current === 0
      ? { text: "Tetap", icon: "", color: "var(--muted)" }
      : // No base to divide by: say it is new rather than "+∞%".
        { text: "Baru", icon: "mdi:arrow-up", color: "var(--chart-good)" };
  }
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(pct * 10) / 10;
  if (rounded === 0) return { text: "0%", icon: "", color: "var(--muted)" };
  const up = rounded > 0;
  return {
    text: `${up ? "+" : "−"}${Math.abs(rounded).toLocaleString("id-ID")}%`,
    icon: up ? "mdi:arrow-up" : "mdi:arrow-down",
    color: up ? "var(--chart-good)" : "var(--chart-bad)",
  };
}
