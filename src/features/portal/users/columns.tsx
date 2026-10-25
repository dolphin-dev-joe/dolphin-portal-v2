import { ColumnTable } from "@components/table/types";
import { IUser } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsUsers: ColumnTable<IUser>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "email",
    title: "Email",
  },
  {
    key: "role",
    title: "Role",
  },
  {
    key: "isActive",
    title: "Status",
    render(item) {
      return <BooleanChip value={item.isActive} />;
    },
  },
  {
    key: "lastLoginAt",
    title: "Last Login",
    render: (item) => {
      return formatDateTimeShort(item.lastLoginAt || "-");
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
