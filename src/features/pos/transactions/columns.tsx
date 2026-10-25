import { ColumnTable } from "@components/table/types";
import { IPosTransaction } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { formatIDR, PAYMENT_LABELS } from "./config";
import { StatusChip } from "./StatusChip";

export const columnsPosTransaction: ColumnTable<IPosTransaction>[] = [
  { key: "invoiceNumber", title: "No. Invoice" },
  { key: "customerName",  title: "Pelanggan" },
  { key: "cashierName",   title: "Kasir" },
  {
    key: "paymentMethod",
    title: "Pembayaran",
    render: (item) => (
      <span className="text-sm font-medium">
        {PAYMENT_LABELS[item.paymentMethod] ?? item.paymentMethod}
      </span>
    ),
  },
  {
    key: "total",
    title: "Total",
    render: (item) => formatIDR(item.total),
  },
  {
    key: "status",
    title: "Status",
    render: (item) => <StatusChip status={item.status} size="sm" />,
  },
  {
    key: "createdAt",
    title: "Tanggal",
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];
