import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosCourierFee } from "@features/pos/courier-fees/columns";
import { IPosCourierFee } from "@features/pos/courier-fees/interfaces";

// Two fixed rows (Jemput, Antar): edit only, no create/delete.
export default function PosCourierFeesListPage() {
  return (
    <DataTable<IPosCourierFee>
      resource="pos-courier-fees"
      actionColumns={[ActionButton.Edit]}
      columns={columnsPosCourierFee}
    />
  );
}
