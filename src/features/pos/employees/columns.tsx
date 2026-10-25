import { ColumnTable } from "@components/table/types";
import { IPosEmployee } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPosEmployee: ColumnTable<IPosEmployee>[] = [
  {
    key: "username",
    title: "Username",
  },
  {
    key: "name",
    title: "Nama",
  },
  {
    key: "role",
    title: "Role",
    render: (item) =>
      item.role === "admin" ? "Admin" : "Kasir",
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
