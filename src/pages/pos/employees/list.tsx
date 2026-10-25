import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosEmployee } from "@features/pos/employees/columns";
import { IPosEmployee } from "@features/pos/employees/interfaces";

export default function PosEmployeesListPage() {
  return (
    <DataTable<IPosEmployee>
      resource="pos-employees"
      actionColumns={[
        ActionButton.Create,
        ActionButton.Edit,
        ActionButton.Delete,
      ]}
      columns={columnsPosEmployee}
      withSearch
    />
  );
}
