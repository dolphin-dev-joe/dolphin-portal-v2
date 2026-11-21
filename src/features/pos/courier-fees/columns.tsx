import { ColumnTable } from "@components/table/types";
import { BooleanChip } from "@components/boolean-chip";
import { formatIDR } from "@features/pos/transactions/config";
import { formatDateTimeShort } from "@utils/date";
import { COURIER_FEE_LABELS, IPosCourierFee } from "./interfaces";

export const columnsPosCourierFee: ColumnTable<IPosCourierFee>[] = [
  {
    key: "name",
    title: "Nama",
  },
  {
    key: "code",
    title: "Jenis",
    render: (item) => COURIER_FEE_LABELS[item.code] ?? item.code,
  },
  {
    key: "price",
    title: "Harga",
    render: (item) => formatIDR(item.price),
  },
  {
    key: "isActive",
    title: "Ditawarkan di POS",
    render: (item) => <BooleanChip value={item.isActive} />,
  },
  {
    key: "updatedAt",
    title: "Diubah",
    render: (item) => formatDateTimeShort(item.updatedAt || "-"),
  },
];
