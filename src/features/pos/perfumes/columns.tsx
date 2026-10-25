import { ColumnTable } from "@components/table/types";
import { IPosPerfume } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPosPerfume: ColumnTable<IPosPerfume>[] = [
  {
    key: "name",
    title: "Nama Parfum",
  },
  {
    key: "categoryName",
    title: "Kategori",
    render: (item) => item.categoryName ?? "-",
  },
  {
    key: "sortOrder",
    title: "Urutan",
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
