import { ColumnTable } from "@components/table/types";
import { IFaq } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsFaq: ColumnTable<IFaq>[] = [
  {
    key: "question",
    title: "Question",
  },
  {
    key: "answer",
    title: "Answer",
  },
  {
    key: "sortOrder",
    title: "Order",
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
