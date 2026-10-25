import { ColumnTable } from "@components/table/types";
import { IUser, userRoleLabel } from "./interfaces";
import { formatDateTimeShort } from "@utils/date";
import { BooleanChip } from "@components/boolean-chip";

export const columnsUsers: ColumnTable<IUser>[] = [
  {
    key: "name",
    title: "Name",
  },
  {
    key: "username",
    title: "Username",
    render: (item) => item.username || "-",
  },
  {
    key: "email",
    title: "Email",
    render: (item) => item.email || "-",
  },
  {
    key: "role",
    title: "Role",
    render: (item) => userRoleLabel(item.role),
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
