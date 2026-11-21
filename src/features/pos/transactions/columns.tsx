import { Icon } from "@iconify/react";
import { ColumnTable, DataTableExportOptions } from "@components/table/types";
import { IPosTransaction } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { formatIDR, PAYMENT_LABELS, STATUS_CONFIG } from "./config";
import { PaymentStatusChip, StatusChip } from "./StatusChip";

export const columnsPosTransaction: ColumnTable<IPosTransaction>[] = [
  { key: "invoiceNumber", title: "No. Invoice" },
  { key: "customerName",  title: "Pelanggan" },
  { key: "cashierName",   title: "Kasir" },
  {
    key: "paymentStatus",
    title: "Pembayaran",
    export: {
      value: (item) =>
        item.paymentStatus === "unpaid"
          ? "Belum Bayar"
          : item.paymentMethod
            ? PAYMENT_LABELS[item.paymentMethod] ?? item.paymentMethod
            : "Lunas",
    },
    render: (item) =>
      item.paymentStatus === "unpaid" ? (
        <PaymentStatusChip status="unpaid" size="sm" />
      ) : (
        <span className="text-sm font-medium">
          {item.paymentMethod ? PAYMENT_LABELS[item.paymentMethod] ?? item.paymentMethod : "-"}
        </span>
      ),
  },
  {
    key: "total",
    title: "Total",
    export: { format: "currency" },
    render: (item) =>
      item.pickupFee != null || item.deliveryFee != null ? (
        <span className="inline-flex items-center gap-1.5" title="Termasuk biaya antar jemput">
          {formatIDR(item.total)}
          <Icon icon="mdi:moped-outline" width={16} className="text-muted" />
        </span>
      ) : (
        formatIDR(item.total)
      ),
  },
  {
    key: "status",
    title: "Status",
    export: { value: (item) => STATUS_CONFIG[item.status]?.label ?? item.status },
    render: (item) => <StatusChip status={item.status} size="sm" />,
  },
  {
    key: "createdAt",
    title: "Tanggal",
    export: { format: "datetime" },
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];

/** Export-only columns shared by the transaction lists. */
export function transactionExportOptions(
  fileName: string,
  title: string,
): DataTableExportOptions<IPosTransaction> {
  return {
    fileName,
    title,
    extraColumns: [
      { key: "customerPhone", title: "No. HP" },
      { key: "perfumeName", title: "Parfum" },
      { key: "subtotal", title: "Subtotal", format: "currency" },
      { key: "paidAt", title: "Tanggal Bayar", format: "datetime" },
      { key: "estimatedCompletionAt", title: "Estimasi Selesai", format: "datetime" },
    ],
  };
}
