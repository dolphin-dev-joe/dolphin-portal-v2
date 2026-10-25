import { ColumnTable } from "@components/table/types";
import { IPerfumeCategory } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPerfumeCategories: ColumnTable<IPerfumeCategory>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "nameEn",
    title: "Name (En)",
  },
  {
    key: "sortOrder",
    title: "Sort Order",
  },
  {
    key: "isActive",
    title: "Status",
    render(item) {
      return <BooleanChip value={item.isActive} />;
    },
  },
  {
    key: "createdAt",
    title: "Created At",
    render: (item) => {
      return formatDateTimeShort(item.createdAt || "-");
    },
  },
];
