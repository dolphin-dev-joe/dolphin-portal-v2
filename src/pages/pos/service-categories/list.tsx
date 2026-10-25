import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosServiceCategory } from "@features/pos/service-categories/columns";
import { IPosServiceCategory } from "@features/pos/service-categories/interfaces";

export default function PosServiceCategoriesListPage() {
  return (
    <DataTable<IPosServiceCategory>
      resource="pos-service-categories"
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsPosServiceCategory}
      withSearch
    />
  );
}
