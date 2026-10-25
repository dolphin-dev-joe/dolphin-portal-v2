import { ColumnTable } from "@components/table/types";
import { IPosService } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

function formatIDR(value: string | number) {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export const columnsPosService: ColumnTable<IPosService>[] = [
  {
    key: "name",
    title: "Nama Layanan",
  },
  {
    key: "categoryName",
    title: "Kategori",
    render: (item) => item.categoryName ?? "-",
  },
  {
    key: "price",
    title: "Harga",
    render: (item) => formatIDR(item.price),
  },
  {
    key: "unit",
    title: "Satuan",
  },
  {
    key: "duration",
    title: "Durasi",
    render: (item) => item.duration ?? "-",
  },
  {
    key: "isActive",
    title: "Status",
    render: (item) => <BooleanChip value={item.isActive} />,
  },
  {
    key: "createdAt",
    title: "Dibuat",
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];
