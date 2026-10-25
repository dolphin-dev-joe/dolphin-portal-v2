import { Heading } from "@components/heading";
import StatCard from "@components/stat-card";
import { Text } from "@components/text";
import { Icon } from "@iconify/react";

export interface ContentStats {
  ideas: number;
  drafts: number;
  inReview: number;
  ready: number;
  postedThisMonth: number;
  publishedArticles: number;
  draftArticles: number;
}

export default function ContentDashboard({ stats }: { stats: ContentStats }) {
  return (
    <div className="mx-auto max-w-400 space-y-8 p-4 md:p-6 lg:p-8">
      <div className="space-y-1">
        <Heading as="h1" size="3xl" weight="bold">
          Content Studio
        </Heading>
        <Text muted size="sm">
          Ringkasan konten sosial media dan blog Dolphin Laundry.
        </Text>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Draft & Ide"
          value={String(stats.drafts + stats.ideas)}
          icon={<Icon icon="mdi:pencil-outline" width={24} />}
          bgColor="bg-amber-100 dark:bg-amber-400/10"
          textColor="text-amber-600 dark:text-amber-400"
          delay={0.1}
          href="/social-posts"
        />
        <StatCard
          title="Menunggu Review"
          value={String(stats.inReview)}
          icon={<Icon icon="mdi:eye-check-outline" width={24} />}
          bgColor="bg-blue-100 dark:bg-blue-400/10"
          textColor="text-blue-600 dark:text-blue-400"
          delay={0.2}
          href="/social-posts"
        />
        <StatCard
          title="Siap Posting"
          value={String(stats.ready)}
          icon={<Icon icon="mdi:check-circle-outline" width={24} />}
          bgColor="bg-green-100 dark:bg-green-400/10"
          textColor="text-green-600 dark:text-green-400"
          delay={0.3}
          href="/content-calendar"
        />
        <StatCard
          title="Diposting Bulan Ini"
          value={String(stats.postedThisMonth)}
          icon={<Icon icon="mdi:instagram" width={24} />}
          bgColor="bg-pink-100 dark:bg-pink-400/10"
          textColor="text-pink-600 dark:text-pink-400"
          delay={0.4}
          href="/social-posts"
        />
        <StatCard
          title="Artikel Blog Terbit"
          value={String(stats.publishedArticles)}
          icon={<Icon icon="mdi:newspaper-variant-outline" width={24} />}
          bgColor="bg-purple-100 dark:bg-purple-400/10"
          textColor="text-purple-600 dark:text-purple-400"
          delay={0.5}
          href="/articles"
        />
        <StatCard
          title="Draft Artikel"
          value={String(stats.draftArticles)}
          icon={<Icon icon="mdi:file-document-edit-outline" width={24} />}
          bgColor="bg-slate-100 dark:bg-slate-400/10"
          textColor="text-slate-600 dark:text-slate-400"
          delay={0.6}
          href="/articles"
        />
      </div>
    </div>
  );
}
