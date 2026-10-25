import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosPerfumeCategory } from "@features/pos/perfume-categories/columns";
import { IPosPerfumeCategory } from "@features/pos/perfume-categories/interfaces";

export default function PosPerfumeCategoriesListPage() {
  return (
    <DataTable<IPosPerfumeCategory>
      resource="pos-perfume-categories"
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsPosPerfumeCategory}
      withSearch
    />
  );
}
