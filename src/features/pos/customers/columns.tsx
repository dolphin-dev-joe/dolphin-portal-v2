import { ColumnTable } from "@components/table/types";
import { IPosCustomer } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPosCustomer: ColumnTable<IPosCustomer>[] = [
  {
    key: "name",
    title: "Nama",
  },
  {
    key: "phone",
    title: "Telepon",
    render: (item) => item.phone ?? "-",
  },
  {
    key: "address",
    title: "Alamat",
    render: (item) => item.address ?? "-",
  },
  {
    key: "isActive",
    title: "Status",
    export: { value: (item) => (item.isActive ? "Aktif" : "Nonaktif") },
    render: (item) => <BooleanChip value={item.isActive} />,
  },
  {
    key: "createdAt",
    title: "Dibuat",
    export: { format: "datetime" },
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];
