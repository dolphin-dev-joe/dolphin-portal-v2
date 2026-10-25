import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPerfume } from "@features/landing-page-content/perfumes/columns";
import { IPerfume } from "@features/landing-page-content/perfumes/interfaces";
import { usePerfumeFilters } from "@features/landing-page-content/perfumes/filters";

export default function PerfumesPage() {
  const filters = usePerfumeFilters();

  return (
    <>
      <DataTable<IPerfume>
        resource={"perfumes"}
        columns={columnsPerfume}
        withSearch
        customFilters={filters}
        actionColumns={[
          ActionButton.Create,
          ActionButton.Edit,
          ActionButton.Delete,
        ]}
      />
    </>
  );
}
