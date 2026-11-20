import { cn } from "@heroui/react";

import { StatCardGrid } from "@components/stat-card";
import ChartCard, { DataTableView } from "./components/ChartCard";
import KpiTile from "./components/KpiTile";
import PaymentMix, { formatShare } from "./components/PaymentMix";
import PeakHours, { busiest } from "./components/PeakHours";
import TopServices from "./components/TopServices";
import TrendChart from "./components/TrendChart";
import {
  formatBucketLabel,
  formatHourSlot,
  formatNumber,
  formatRupiah,
  formatRupiahTile,
  PAYMENT_LABELS,
  WEEKDAYS,
} from "./format";
import type { Granularity, PosStatistics } from "./interfaces";

const PER: Record<Granularity, string> = { day: "hari", week: "minggu", month: "bulan" };

// Indonesian zone abbreviations for the store's APP_TIMEZONE.
const ZONE: Record<string, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Pontianak": "WIB",
  "Asia/Makassar": "WITA",
  "Asia/Jayapura": "WIT",
};

interface StatisticsDashboardProps {
  stats: PosStatistics;
  /** True while the previous range is still shown and a new one is loading. */
  isRefreshing?: boolean;
}

/** KPI row + charts for one date range. Data only; fetching lives in the page. */
export default function StatisticsDashboard({ stats, isRefreshing = false }: StatisticsDashboardProps) {
  const { summary, previous, trend, paymentMethods, services, hours } = stats;
  const g = stats.range.granularity;
  const zone = ZONE[stats.range.timezone] ?? stats.range.timezone;
  const revenueTotal = paymentMethods.reduce((sum, p) => sum + p.revenue, 0);

  const trendTable = (
    <DataTableView
      headers={["Periode", "Pendapatan", "Order"]}
      align={["start", "end", "end"]}
      rows={trend.map((p) => [formatBucketLabel(p.date, g), formatRupiah(p.revenue), formatNumber(p.orders)])}
    />
  );

  return (
    <div
      aria-busy={isRefreshing}
      className={cn("space-y-4 transition-opacity duration-200", isRefreshing && "opacity-60")}
    >
      <StatCardGrid>
        <KpiTile
          label="Pendapatan"
          value={formatRupiahTile(summary.revenue)}
          current={summary.revenue}
          previous={previous.revenue}
          comparisonLabel="vs periode lalu"
        />
        <KpiTile
          label="Order"
          value={formatNumber(summary.orders)}
          current={summary.orders}
          previous={previous.orders}
          comparisonLabel="vs periode lalu"
          footnote={
            summary.cancelledOrders > 0 ? `${formatNumber(summary.cancelledOrders)} dibatalkan` : undefined
          }
        />
        <KpiTile
          label="Rata-rata per order"
          value={formatRupiahTile(summary.averageOrderValue)}
          current={summary.averageOrderValue}
          previous={previous.averageOrderValue}
          comparisonLabel="vs periode lalu"
        />
        <KpiTile
          label="Pelanggan baru"
          value={formatNumber(summary.newCustomers)}
          current={summary.newCustomers}
          previous={previous.newCustomers}
          comparisonLabel="vs periode lalu"
        />
      </StatCardGrid>

      {/* Two columns on wide screens: the trend charts grow to the height of
          the lists beside them instead of leaving empty space in a card. */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-2">
          <ChartCard
            className="flex-1"
            title="Pendapatan"
            description={`Uang yang diterima per ${PER[g]}.`}
            table={trendTable}
          >
            <TrendChart data={trend} granularity={g} metric="revenue" />
          </ChartCard>

          <ChartCard
            className="flex-1"
            title="Jumlah order"
            description={`Order masuk per ${PER[g]}, tanpa yang dibatalkan.`}
            table={trendTable}
          >
            <TrendChart data={trend} granularity={g} metric="orders" />
          </ChartCard>
        </div>

        <div className="flex min-w-0 flex-col gap-4">
          <ChartCard
            title="Metode pembayaran"
            description="Pembagian uang yang diterima."
            table={
              <DataTableView
                headers={["Metode", "Pendapatan", "Bagian", "Transaksi"]}
                align={["start", "end", "end", "end"]}
                rows={paymentMethods.map((p) => [
                  PAYMENT_LABELS[p.method] ?? p.method,
                  formatRupiah(p.revenue),
                  revenueTotal > 0 ? formatShare(p.revenue / revenueTotal) : "-",
                  formatNumber(p.orders),
                ])}
              />
            }
          >
            <PaymentMix data={paymentMethods} />
          </ChartCard>

          <ChartCard
            title="Layanan terlaris"
            description="Nilai layanan dari order di periode ini."
            table={
              <DataTableView
                headers={["Layanan", "Jumlah", "Order", "Nilai"]}
                align={["start", "end", "end", "end"]}
                rows={services.map((s) => [
                  s.serviceName,
                  `${formatNumber(s.quantity)}${s.unit ? ` ${s.unit}` : ""}`,
                  formatNumber(s.orders),
                  formatRupiah(s.revenue),
                ])}
              />
            }
          >
            <TopServices data={services} />
          </ChartCard>
        </div>

        <ChartCard
          className="xl:col-span-3"
          title="Jam sibuk"
          description={`Order masuk per hari dan jam (${zone}). Bantu atur jadwal karyawan.`}
          table={
            <DataTableView
              headers={["Hari", "Jam", "Order"]}
              align={["start", "start", "end"]}
              rows={busiest(hours).map((c) => [
                WEEKDAYS[c.weekday - 1],
                formatHourSlot(c.hour),
                formatNumber(c.orders),
              ])}
            />
          }
        >
          <PeakHours data={hours} />
        </ChartCard>
      </div>
    </div>
  );
}
