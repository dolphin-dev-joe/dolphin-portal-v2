import DataTable from "@components/table";
import { CustomFilter } from "@components/table/types";
import { columnsApprovals } from "@features/portal/approvals/columns";
import {
  APPROVALS_RESOURCE,
  APPROVAL_STATUS_OPTIONS,
  type IApproval,
} from "@features/portal/approvals/interfaces";
import { useApprovalRowActions } from "@features/portal/approvals/useApprovalDecision";

const filters: CustomFilter<IApproval>[] = [
  {
    key: "status",
    label: "Status",
    placeholder: "Semua status",
    type: "single",
    options: [{ label: "Semua status", value: "all" }, ...APPROVAL_STATUS_OPTIONS],
  },
];

// Requests from POS cashiers for admin-only actions. Answering here replaces
// typing an admin password on the cashier's tablet.
export default function ApprovalsListPage() {
  const rowActions = useApprovalRowActions();
  return (
    <DataTable<IApproval>
      resource={APPROVALS_RESOURCE}
      label="Persetujuan POS"
      description="Kasir minta izin untuk fitur khusus admin di tablet POS. Setujui atau tolak di sini; tablet lanjut sendiri. Permintaan kedaluwarsa setelah 5 menit."
      columns={columnsApprovals}
      withSearch
      customFilters={filters}
      customRowActionButtons={rowActions}
      sorters={[{ field: "createdAt", order: "desc" }]}
      exportOptions={{ fileName: "persetujuan-pos", title: "Persetujuan POS" }}
    />
  );
}
