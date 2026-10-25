import { ColumnTable } from "@components/table/types";
import { IPerfume } from "./interfaces";

export const columnsPerfume: ColumnTable<IPerfume>[] = [
  {
    key: "categoryId",
    title: "Category ID",
  },
  {
    key: "category",
    title: "Category",
    render(item) {
      return item.category?.name || "-";
    },
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "nameEn",
    title: "Name (EN)",
  },
  {
    key: "sortOrder",
    title: "Sort Order",
  },
];
