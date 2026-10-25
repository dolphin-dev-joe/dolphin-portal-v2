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
    render: (item) => <BooleanChip value={item.isActive} />,
  },
  {
    key: "createdAt",
    title: "Dibuat",
    render: (item) => formatDateTimeShort(item.createdAt || "-"),
  },
];
