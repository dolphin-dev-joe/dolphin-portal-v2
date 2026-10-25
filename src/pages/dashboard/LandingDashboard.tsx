import { Heading } from "@components/heading";
import StatCard from "@components/stat-card";
import { Text } from "@components/text";
import { Icon } from "@iconify/react";

export interface LandingStats {
  totalPerfumes: number;
  totalPerfumeCategories: number;
  totalPricings: number;
  totalFaqs: number;
}

export default function LandingDashboard({ stats }: { stats: LandingStats }) {
  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8 max-w-[1600px] mx-auto">
      <div className="space-y-1">
        <Heading as="h1" size="3xl" weight="bold">
          Landing Page Dashboard
        </Heading>
        <Text muted size="sm">
          Ringkasan konten yang tampil di website Dolphin Laundry.
        </Text>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Parfum"
          value={String(stats.totalPerfumes)}
          icon={<Icon icon="tabler:perfume" width={24} />}
          bgColor="bg-pink-100 dark:bg-pink-400/10"
          textColor="text-pink-600 dark:text-pink-400"
          delay={0.1}
          href="/perfumes"
        />
        <StatCard
          title="Kategori Parfum"
          value={String(stats.totalPerfumeCategories)}
          icon={<Icon icon="carbon:category-new-each" width={24} />}
          bgColor="bg-blue-100 dark:bg-blue-400/10"
          textColor="text-blue-600 dark:text-blue-400"
          delay={0.2}
          href="/perfume-categories"
        />
        <StatCard
          title="Daftar Harga"
          value={String(stats.totalPricings)}
          icon={<Icon icon="mdi:currency-usd" width={24} />}
          bgColor="bg-green-100 dark:bg-green-400/10"
          textColor="text-green-600 dark:text-green-400"
          delay={0.3}
          href="/pricings"
        />
        <StatCard
          title="FAQ"
          value={String(stats.totalFaqs)}
          icon={<Icon icon="mdi:help-circle" width={24} />}
          bgColor="bg-amber-100 dark:bg-amber-400/10"
          textColor="text-amber-600 dark:text-amber-400"
          delay={0.4}
          href="/faqs"
        />
      </div>
    </div>
  );
}
