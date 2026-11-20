import { Button, Card, Typography } from "@heroui/react";
import { useCustom } from "@refinedev/core";
import { useState } from "react";

import LoadingScreen from "@components/loading/LoadingScreen";
import RangeFilter from "@features/pos/statistics/components/RangeFilter";
import StatisticsDashboard from "@features/pos/statistics/StatisticsDashboard";
import { formatRange } from "@features/pos/statistics/format";
import type { PosStatistics } from "@features/pos/statistics/interfaces";
import { DEFAULT_PRESET, presetRange, type DateRange, type PresetKey } from "@features/pos/statistics/ranges";

export default function PosStatisticsPage() {
  const [preset, setPreset] = useState<PresetKey | "custom">(DEFAULT_PRESET);
  const [custom, setCustom] = useState<DateRange | null>(null);
  const range: DateRange =
    preset === "custom" && custom ? custom : presetRange(preset === "custom" ? DEFAULT_PRESET : preset);

  const { result, query } = useCustom<{ data: PosStatistics }>({
    url: "pos/statistics",
    method: "get",
    config: { query: { from: range.from, to: range.to } },
    // Keep the previous charts on screen (dimmed) while a new range loads.
    queryOptions: { placeholderData: (previous) => previous },
    errorNotification: false,
  });

  const stats = result?.data?.data;

  if (!stats && query.isLoading) return <LoadingScreen />;

  return (
    <div className="mx-auto max-w-400 space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <Typography type="h4">Statistik Bisnis</Typography>
        <Typography type="body-sm" color="muted">
          Pantau pendapatan, order, dan layanan Dolphin Laundry. Pendapatan dihitung saat uang diterima.
        </Typography>
      </div>

      {/* One filter row scopes every number and chart below it. */}
      <div className="space-y-2">
        <RangeFilter
          preset={preset}
          custom={custom}
          onPreset={setPreset}
          onCustom={(r) => {
            setCustom(r);
            setPreset("custom");
          }}
        />
        {stats && (
          <Typography type="body-xs" color="muted">
            {formatRange(stats.range.from, stats.range.to)} · dibandingkan dengan{" "}
            {formatRange(stats.range.previousFrom, stats.range.previousTo)}
          </Typography>
        )}
      </div>

      {stats ? (
        // Dim only while the previous range is still on screen, not on background refetches.
        <StatisticsDashboard stats={stats} isRefreshing={query.isPlaceholderData} />
      ) : (
        <Card>
          <Card.Content className="flex flex-col items-center gap-3 py-10 text-center">
            <Typography type="body" weight="medium">
              Statistik gagal dimuat.
            </Typography>
            <Typography type="body-sm" color="muted">
              {query.error?.message ?? "Periksa koneksi lalu coba lagi."}
            </Typography>
            <Button size="sm" variant="secondary" onPress={() => query.refetch()}>
              Coba lagi
            </Button>
          </Card.Content>
        </Card>
      )}
    </div>
  );
}
