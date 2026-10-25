import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosService } from "@features/pos/services/columns";
import { IPosService } from "@features/pos/services/interfaces";
import { usePosServiceFilters } from "@features/pos/services/filters";

export default function PosServicesListPage() {
  const filters = usePosServiceFilters();

  return (
    <DataTable<IPosService>
      resource="pos-services"
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsPosService}
      withSearch
      customFilters={filters}
    />
  );
}
