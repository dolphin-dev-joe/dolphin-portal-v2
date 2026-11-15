import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsAppRelease } from "@features/pos/app-releases/columns";
import { IAppRelease } from "@features/pos/app-releases/interfaces";

// The newest published build is what the tablets install. Unpublish a bad
// build from its detail page; a fix is a new upload with a higher build number.
export default function PosAppReleasesListPage() {
  return (
    <DataTable<IAppRelease>
      resource="pos-app-releases"
      label="Rilis Aplikasi POS"
      description="Upload APK baru di sini. Tablet di laundry akan menawarkan update otomatis dari dalam aplikasi."
      columns={columnsAppRelease}
      withSearch
      actionColumns={[ActionButton.Create, ActionButton.Show]}
    />
  );
}
