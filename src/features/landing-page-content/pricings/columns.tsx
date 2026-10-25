import { ColumnTable } from "@components/table/types";
import { BooleanChip } from "@components/boolean-chip";
import { formatDateTimeShort } from "@utils/date";
import { IPricing } from "./interfaces";

export const columnsPricingItems: ColumnTable<IPricing>[] = [
  {
    key: "categoryName",
    title: "Category",
    render: (item) => item.categoryName ?? "-",
  },
  {
    key: "name",
    title: "Name",
  },
  {
    key: "nameEn",
    title: "Name (En)",
    render: (item) => item.nameEn ?? "-",
  },
  {
    key: "price",
    title: "Price",
    render: (item) => `Rp ${Number(item.price).toLocaleString("id-ID")}`,
  },
  {
    key: "unit",
    title: "Unit",
  },
  {
    key: "durationText",
    title: "Duration",
    render: (item) => item.durationText ?? "-",
  },
  {
    key: "notes",
    title: "Notes / Layanan",
    render: (item) => item.notes ?? "-",
  },
  {
    key: "sortOrder",
    title: "Sort Order",
  },
  {
    key: "isActive",
    title: "Status",
    render: (item) => <BooleanChip value={item.isActive} />,
  },
  {
    key: "createdAt",
    title: "Created At",
    render: (item) => formatDateTimeShort(String(item.createdAt) || "-"),
  },
];
