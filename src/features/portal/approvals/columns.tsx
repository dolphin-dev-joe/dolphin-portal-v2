import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import { ColumnTable } from "@components/table/types";
import { formatDateTimeShort } from "@utils/date";
import {
  APPROVAL_STATUS_CONFIG,
  approvalActionLabel,
  type ApprovalStatus,
  type IApproval,
} from "./interfaces";

export function ApprovalStatusChip({ status }: { status: ApprovalStatus }) {
  // An older portal may meet a status a newer API added: show it as-is.
  const cfg = APPROVAL_STATUS_CONFIG[status] ?? { ...APPROVAL_STATUS_CONFIG.cancelled, label: status };
  return (
    <Chip color={cfg.color} variant="soft" size="sm">
      <Icon icon={cfg.icon} width={14} />
      <Chip.Label>{cfg.label}</Chip.Label>
    </Chip>
  );
}

export const columnsApprovals: ColumnTable<IApproval>[] = [
  {
    key: "createdAt",
    title: "Waktu",
    allowsSorting: true,
    render: (item) => formatDateTimeShort(item.createdAt),
    export: { format: "datetime" },
  },
  {
    key: "requestedByName",
    title: "Kasir",
  },
  {
    key: "deviceName",
    title: "Perangkat",
    render: (item) => item.deviceName || "-",
  },
  {
    key: "action",
    title: "Permintaan",
    render: (item) => approvalActionLabel(item.action),
    export: { value: (item) => approvalActionLabel(item.action) },
  },
  {
    key: "status",
    title: "Status",
    render: (item) => <ApprovalStatusChip status={item.status} />,
    export: { value: (item) => APPROVAL_STATUS_CONFIG[item.status]?.label ?? item.status },
  },
  {
    key: "decidedByName",
    title: "Diputuskan oleh",
    render: (item) => item.decidedByName || "-",
  },
  {
    key: "decidedAt",
    title: "Diputuskan",
    render: (item) => (item.decidedAt ? formatDateTimeShort(item.decidedAt) : "-"),
    export: { format: "datetime" },
  },
];
