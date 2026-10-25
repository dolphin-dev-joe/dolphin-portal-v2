import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosPerfume } from "@features/pos/perfumes/columns";
import { IPosPerfume } from "@features/pos/perfumes/interfaces";
import { usePosPerfumeFilters } from "@features/pos/perfumes/filters";

export default function PosPerfumesListPage() {
  const filters = usePosPerfumeFilters();

  return (
    <DataTable<IPosPerfume>
      resource="pos-perfumes"
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsPosPerfume}
      withSearch
      customFilters={filters}
    />
  );
}
