import DataTable from "@components/table";
import { ActionButton, CustomFilter } from "@components/table/types";
import { columnsPosTransaction } from "@features/pos/transactions/columns";
import { IPosTransaction } from "@features/pos/transactions/interfaces";

const statusFilters: CustomFilter<IPosTransaction>[] = [
  {
    key: "status",
    label: "Status",
    placeholder: "Pilih Status",
    type: "single",
    options: [
      { label: "Semua Status", value: "all" },
      { label: "Masuk", value: "pending" },
      { label: "Sedang Dicuci", value: "processing" },
      { label: "Siap Diambil", value: "ready" },
      { label: "Sudah Diambil", value: "picked_up" },
      { label: "Selesai", value: "completed" },
      { label: "Dibatalkan", value: "cancelled" },
    ],
  },
];

export default function PosTransactionsListPage() {
  return (
    <DataTable<IPosTransaction>
      resource="pos-transactions"
      label="Transaksi POS"
      description="Riwayat transaksi kasir Dolphin POS (read-only)."
      columns={columnsPosTransaction}
      withSearch
      customFilters={statusFilters}
      actionColumns={[ActionButton.Show]}
    />
  );
}
