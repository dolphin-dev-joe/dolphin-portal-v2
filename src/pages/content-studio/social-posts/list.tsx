import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsSocialPost } from "@features/content-studio/social-posts/columns";
import { socialPostFilters } from "@features/content-studio/social-posts/filters";
import type { ISocialPost } from "@features/content-studio/social-posts/interfaces";

export default function SocialPostListPage() {
  return (
    <DataTable<ISocialPost>
      resource="social-posts"
      label="Postingan Sosmed"
      description="Workspace konten Instagram: tulis caption, kumpulkan desain, review, lalu posting manual."
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Show,
        ActionButton.Delete,
      ]}
      columns={columnsSocialPost}
      customFilters={socialPostFilters}
      withSearch
    />
  );
}
