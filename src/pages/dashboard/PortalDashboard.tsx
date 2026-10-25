import { Heading } from "@components/heading";
import StatCard from "@components/stat-card";
import { Text } from "@components/text";
import { Icon } from "@iconify/react";

export interface PortalStats {
  totalUsers: number;
  activeUsers: number;
  adminUsers: number;
}

export default function PortalDashboard({ stats }: { stats: PortalStats }) {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-1">
        <Heading as="h1" size="3xl" weight="bold">
          Portal Management Dashboard
        </Heading>
        <Text muted size="sm">
          Ringkasan pengguna dan akses portal Dolphin Laundry.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          title="Total Pengguna"
          value={String(stats.totalUsers)}
          icon={<Icon icon="mdi:account-multiple" width={24} />}
          bgColor="bg-blue-100 dark:bg-blue-400/10"
          textColor="text-blue-600 dark:text-blue-400"
          delay={0.1}
          href="/users"
        />
        <StatCard
          title="Pengguna Aktif"
          value={String(stats.activeUsers)}
          icon={<Icon icon="mdi:account-check" width={24} />}
          bgColor="bg-green-100 dark:bg-green-400/10"
          textColor="text-green-600 dark:text-green-400"
          delay={0.2}
        />
        <StatCard
          title="Admin"
          value={String(stats.adminUsers)}
          icon={<Icon icon="mdi:shield-account" width={24} />}
          bgColor="bg-purple-100 dark:bg-purple-400/10"
          textColor="text-purple-600 dark:text-purple-400"
          delay={0.3}
        />
      </div>
    </div>
  );
}
