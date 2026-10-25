import { ColumnTable } from "@components/table/types";
import { IPosPerfumeCategory } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPosPerfumeCategory: ColumnTable<IPosPerfumeCategory>[] = [
  {
    key: "name",
    title: "Nama Kategori",
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
