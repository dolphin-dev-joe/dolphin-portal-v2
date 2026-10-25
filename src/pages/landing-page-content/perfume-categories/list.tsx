import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPerfumeCategories } from "@features/landing-page-content/perfume-categories/columns";
import { IPerfumeCategory } from "@features/landing-page-content/perfume-categories/interfaces";

export default function PerfumeCategoriesPage() {
  return (
    <>
      <DataTable<IPerfumeCategory>
        resource={"perfume-categories"}
        columns={columnsPerfumeCategories}
        withSearch
        actionColumns={[
          ActionButton.Create,
          ActionButton.Edit,
          ActionButton.Delete,
          ActionButton.Show,
        ]}
      />
    </>
  );
}
