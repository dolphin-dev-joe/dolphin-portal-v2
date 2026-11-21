import DataTable from "@components/table";
import { ActionButton, CustomFilter } from "@components/table/types";
import {
  columnsPosTransaction,
  transactionExportOptions,
} from "@features/pos/transactions/columns";
import { IPosTransaction } from "@features/pos/transactions/interfaces";
import { useWhatsAppRowAction } from "@features/pos/transactions/whatsapp";

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
  {
    key: "paymentStatus",
    label: "Pembayaran",
    placeholder: "Status Bayar",
    type: "single",
    options: [
      { label: "Semua", value: "all" },
      { label: "Lunas", value: "paid" },
      { label: "Belum Bayar", value: "unpaid" },
    ],
  },
];

export default function PosTransactionsListPage() {
  const whatsAppAction = useWhatsAppRowAction();
  return (
    <DataTable<IPosTransaction>
      resource="pos-transactions"
      label="Transaksi POS"
      description="Riwayat transaksi kasir Dolphin POS."
      columns={columnsPosTransaction}
      withSearch
      customFilters={statusFilters}
      exportOptions={transactionExportOptions("transaksi-pos", "Transaksi POS")}
      actionColumns={[ActionButton.Show]}
      customRowActionButtons={[whatsAppAction]}
    />
  );
}
