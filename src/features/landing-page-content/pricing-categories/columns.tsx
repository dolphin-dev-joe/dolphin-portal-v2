import { ColumnTable } from "@components/table/types";
import { IPricingCategory } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsPricingCategory: ColumnTable<IPricingCategory>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "nameEn",
    title: "Name (En)",
  },
  {
    key: "description",
    title: "Description",
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
