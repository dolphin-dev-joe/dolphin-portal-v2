import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipContentProps,
} from "recharts";
import type { Granularity, TrendPoint } from "../interfaces";
import { formatBucketLabel, formatBucketTick, formatCompact, formatNumber, formatRupiah } from "../format";

interface TrendChartProps {
  data: TrendPoint[];
  granularity: Granularity;
  /** revenue → area (money over time); orders → columns (counts per bucket). */
  metric: "revenue" | "orders";
  /** Minimum height; the chart grows to fill a taller card. */
  minHeight?: number;
}

const AXIS_TICK = { fill: "var(--muted)", fontSize: 12 };

/**
 * One measure per chart: revenue and order count have different scales, so
 * they get two charts instead of one chart with two y-axes. The tooltip
 * still shows both for the hovered bucket.
 */
export default function TrendChart({ data, granularity, metric, minHeight = 240 }: TrendChartProps) {
  const xAxis = (
    <XAxis
      dataKey="date"
      tickFormatter={(d: string) => formatBucketTick(d, granularity)}
      tick={AXIS_TICK}
      tickLine={false}
      axisLine={{ stroke: "var(--chart-axis)" }}
      minTickGap={20}
      tickMargin={8}
    />
  );
  const yAxis = (
    <YAxis
      tickFormatter={(v: number) => formatCompact(v)}
      tick={AXIS_TICK}
      tickLine={false}
      axisLine={false}
      allowDecimals={false}
      width={44}
    />
  );
  const grid = <CartesianGrid vertical={false} stroke="var(--chart-grid)" />;
  const tooltip = (cursor: object) => (
    <Tooltip
      cursor={cursor}
      content={(props) => <TrendTooltip {...props} granularity={granularity} metric={metric} />}
      isAnimationActive={false}
    />
  );

  return (
    <div style={{ minHeight }} className="w-full min-w-0 flex-1">
      {/* minHeight keeps the chart visible when the card is not stretched (one column). */}
      <ResponsiveContainer width="100%" height="100%" minHeight={minHeight}>
        {metric === "revenue" ? (
          <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            {grid}
            {xAxis}
            {yAxis}
            {tooltip({ stroke: "var(--chart-axis)", strokeWidth: 1 })}
            <Area
              type="linear"
              dataKey="revenue"
              name="Pendapatan"
              stroke="var(--chart-1)"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
              fill="var(--chart-1)"
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)", stroke: "var(--surface)", strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }} barCategoryGap={2}>
            {grid}
            {xAxis}
            {yAxis}
            {tooltip({ fill: "var(--chart-hover)" })}
            <Bar
              dataKey="orders"
              name="Order"
              fill="var(--chart-1)"
              maxBarSize={24}
              radius={[4, 4, 0, 0]}
              isAnimationActive={false}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

function TrendTooltip({
  active,
  payload,
  granularity,
  metric,
}: TooltipContentProps & { granularity: Granularity; metric: "revenue" | "orders" }) {
  const point = payload?.[0]?.payload as TrendPoint | undefined;
  if (!active || !point) return null;

  const rows = [
    { key: "revenue", label: "Pendapatan", value: formatRupiah(point.revenue) },
    { key: "orders", label: "Order", value: formatNumber(point.orders) },
  ];
  // The charted measure first.
  if (metric === "orders") rows.reverse();

  return (
    <div className="min-w-40 rounded-lg border border-(--chart-grid) bg-overlay px-3 py-2 text-xs shadow-md backdrop-blur-md">
      <div className="mb-1.5 font-medium text-muted">{formatBucketLabel(point.date, granularity)}</div>
      {rows.map((row, i) => (
        <div key={row.key} className="flex items-center gap-2">
          {i === 0 ? (
            <span aria-hidden className="h-0.5 w-3 rounded-full bg-(--chart-1)" />
          ) : (
            <span aria-hidden className="w-3" />
          )}
          <span className="font-semibold text-foreground tabular-nums">{row.value}</span>
          <span className="text-muted">{row.label}</span>
        </div>
      ))}
    </div>
  );
}
