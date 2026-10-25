import { Heading } from "@components/heading";
import StatCard from "@components/stat-card";
import { Text } from "@components/text";
import { Card } from "@heroui/react";
import { Icon } from "@iconify/react";

interface RecentTransaction {
  id: string;
  invoiceNumber: string;
  customerName: string;
  total: string;
  paymentMethod: string;
  status: string;
  createdAt: Date;
}

export interface PosStats {
  todayTransactions: number;
  todayRevenue: number;
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

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

const PAYMENT_COLORS: Record<string, string> = {
  cash: "bg-green-100 text-green-700",
  transfer: "bg-blue-100 text-blue-700",
  qris: "bg-purple-100 text-purple-700",
};

export default function DashboardContent({ stats }: { stats: PosStats }) {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-1">
        <Heading as="h1" size="3xl" weight="bold">
          POS Dashboard
        </Heading>
        <Text muted size="sm">
          Ringkasan operasional POS Dolphin Laundry hari ini.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </div>

      <Card variant="secondary" className="border-none shadow-sm">
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
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">No. Invoice</th>
                  <th className="text-left p-3 font-medium text-gray-500">Pelanggan</th>
                  <th className="text-right p-3 font-medium text-gray-500">Total</th>
                  <th className="text-left p-3 font-medium text-gray-500">Pembayaran</th>
                  <th className="text-left p-3 font-medium text-gray-500">Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-400">
                      Belum ada transaksi
                    </td>
                  </tr>
                ) : (
                  stats.recentTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="border-t hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="p-3 font-mono text-xs">{tx.invoiceNumber}</td>
                      <td className="p-3">{tx.customerName}</td>
                      <td className="p-3 text-right font-medium">{formatIDR(tx.total)}</td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            PAYMENT_COLORS[tx.paymentMethod] ?? "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {PAYMENT_LABELS[tx.paymentMethod] ?? tx.paymentMethod}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500 text-xs">
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
