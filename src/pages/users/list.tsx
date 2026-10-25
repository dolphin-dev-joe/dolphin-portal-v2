import DataTable from "@components/table";
import { ActionButton, ColumnTable } from "@components/table/types";
import { columnsUsers } from "@features/portal/users/columns";


export default function UsersListPage() {
  return (
    <>
      <DataTable
        resource={"users"}
        columns={columnsUsers}
        actionColumns={[
          ActionButton.Create,
          ActionButton.Delete,
          ActionButton.Edit,
        ]}
      />
    </>
  );
}
