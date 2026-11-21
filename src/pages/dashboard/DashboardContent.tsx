import { Heading } from "@components/heading";
import StatCard, { StatCardGrid } from "@components/stat-card";
import { Text } from "@components/text";
import { Card, Link } from "@heroui/react";
import { Icon } from "@iconify/react";
import { PAYMENT_LABELS } from "@features/pos/transactions/config";
import { PaymentStatusChip } from "@features/pos/transactions/StatusChip";

interface RecentTransaction {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: string;
  paymentMethod: string | null;
  paymentStatus: "paid" | "unpaid";
  status: string;
  createdAt: Date;
}

export interface PosStats {
  todayTransactions: number;
  todayRevenue: number;
  unpaidCount: number;
  unpaidTotal: number;
  totalCustomers: number;
  activeServices: number;
  recentTransactions: RecentTransaction[];
}

function formatIDR(value: string | number) {
  const num = Math.round(Number(value));
  return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formatDateShort(date: Date | string) {
  const d = new Date(date);
  const MONTHS = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}


export default function DashboardContent({ stats }: { stats: PosStats }) {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Heading as="h1" size="3xl" weight="bold">
            POS Dashboard
          </Heading>
          <Text muted size="sm">
            Ringkasan operasional POS Dolphin Laundry hari ini.
          </Text>
        </div>
        <Link
          href="/pos/statistics"
          className="flex items-center gap-1.5 text-sm font-medium no-underline"
        >
          <Icon icon="mdi:chart-areaspline" className="size-4" />
          Lihat statistik bisnis
        </Link>
      </div>

      <StatCardGrid>
        <StatCard
          title="Transaksi Hari Ini"
          value={String(stats.todayTransactions)}
          icon={<Icon icon="mdi:receipt" width={24} />}
          bgColor="bg-blue-100 dark:bg-blue-400/10"
          textColor="text-blue-600 dark:text-blue-400"
          delay={0.1}
          href="/pos/transactions"
        />
        <StatCard
          title="Pendapatan Hari Ini"
          value={formatIDR(stats.todayRevenue)}
          icon={<Icon icon="mdi:cash-multiple" width={24} />}
          bgColor="bg-green-100 dark:bg-green-400/10"
          textColor="text-green-600 dark:text-green-400"
          delay={0.2}
        />
        <StatCard
          title={`Belum Dibayar (${stats.unpaidCount} order)`}
          value={formatIDR(stats.unpaidTotal)}
          icon={<Icon icon="mdi:cash-clock" width={24} />}
          bgColor="bg-orange-100 dark:bg-orange-400/10"
          textColor="text-orange-600 dark:text-orange-400"
          delay={0.25}
          href="/pos/unpaid-transactions"
        />
        <StatCard
          title="Total Pelanggan"
          value={String(stats.totalCustomers)}
          icon={<Icon icon="mdi:account-multiple" width={24} />}
          bgColor="bg-amber-100 dark:bg-amber-400/10"
          textColor="text-amber-600 dark:text-amber-400"
          delay={0.3}
          href="/pos/customers"
        />
        <StatCard
          title="Layanan Aktif"
          value={String(stats.activeServices)}
          icon={<Icon icon="mdi:washing-machine" width={24} />}
          bgColor="bg-purple-100 dark:bg-purple-400/10"
          textColor="text-purple-600 dark:text-purple-400"
          delay={0.4}
          href="/pos/services"
        />
      </StatCardGrid>

      <Card className="overflow-hidden">
        <Card.Header>
          <div className="space-y-1">
            <Card.Title>Transaksi Terbaru</Card.Title>
            <Card.Description>
              10 transaksi terakhir dari kasir POS Dolphin Laundry.
            </Card.Description>
          </div>
        </Card.Header>
        <Card.Content className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="accent-table">
              <thead>
                <tr>
                  <th className="pl-6">No. Invoice</th>
                  <th>Pelanggan</th>
                  <th className="text-right">Total</th>
                  <th>Pembayaran</th>
                  <th className="pr-6">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  stats.recentTransactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="pl-6 font-mono text-xs font-medium">{tx.invoiceNumber}</td>
                      <td>{tx.customerName}</td>
                      <td className="text-right font-medium tabular-nums">{formatIDR(tx.total)}</td>
                      <td>
                        {/* Same as the Transaksi list: a chip only when it is still owed. */}
                        {tx.paymentStatus === "unpaid" || !tx.paymentMethod ? (
                          <PaymentStatusChip status="unpaid" size="sm" />
                        ) : (
                          <span className="font-medium">
                            {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                          </span>
                        )}
                      </td>
                      <td className="pr-6 text-xs whitespace-nowrap text-muted">
                        {formatDateShort(tx.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
