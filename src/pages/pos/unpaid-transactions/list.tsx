import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { columnsPosTransaction } from "@features/pos/transactions/columns";
import { IPosTransaction } from "@features/pos/transactions/interfaces";
import { useWhatsAppRowAction } from "@features/pos/transactions/whatsapp";

// Customers may pay at pickup: this lists open orders still owed. Record the
// payment from the transaction detail page (or the cashier does it at pickup).
export default function PosUnpaidTransactionsListPage() {
  const whatsAppAction = useWhatsAppRowAction();
  return (
    <DataTable<IPosTransaction>
      resource="pos-transactions"
      label="Belum Dibayar"
      description="Order yang pelanggannya bayar saat ambil dan belum lunas. Buka detail untuk mencatat pembayaran."
      columns={columnsPosTransaction}
      withSearch
      permanentFilters={[{ field: "outstanding", value: true }]}
      actionColumns={[ActionButton.Show]}
      customRowActionButtons={[whatsAppAction]}
    />
  );
}
