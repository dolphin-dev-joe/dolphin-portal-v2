import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosCustomer } from "@features/pos/customers/columns";
import { IPosCustomer } from "@features/pos/customers/interfaces";

export default function PosCustomersListPage() {
  return (
    <DataTable<IPosCustomer>
      resource="pos-customers"
      actionColumns={[ActionButton.Show]}
      columns={columnsPosCustomer}
      withSearch
    />
  );
}
