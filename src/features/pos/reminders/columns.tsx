import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";

import type { ColumnTable } from "@components/table/types";
import { HintTooltip } from "@components/table/TableTooltip";
import { formatIDR } from "@features/pos/transactions/config";
import type { IPosTransaction } from "@features/pos/transactions/interfaces";
import {
  PaymentStatusChip,
  StatusChip,
} from "@features/pos/transactions/StatusChip";
import { formatDateTimeShort } from "@utils/date";
import { daysSince, relativeDays, type ReminderKind } from "./messages";

function CustomerCell({ tx }: { tx: IPosTransaction }) {
  return (
    <div className="flex flex-col">
      <span className="font-medium">{tx.customerName}</span>
      <span className="text-xs text-muted">
        {tx.customerPhone ||
          (tx.customerId ? "Belum ada No. HP" : "Tanpa akun pelanggan")}
      </span>
    </div>
  );
}

/** "5 hari" in red after a week, amber after 3 days. */
function WaitingCell({
  since,
  kind,
}: {
  since?: string | null;
  kind: ReminderKind;
}) {
  const days = daysSince(since);
  if (days === null) return <span className="text-muted">-</span>;
  const color = days >= 7 ? "danger" : days >= 3 ? "warning" : "default";
  const what = kind === "pickup" ? "Menunggu diambil" : "Belum dibayar";
  const hint =
    days >= 7
      ? `${what} lebih dari seminggu, sebaiknya segera diingatkan.`
      : days >= 3
      ? `${what} sudah ${days} hari.`
      : `${what} ${
          days === 0 ? "sejak hari ini" : `${days} hari`
        }, masih wajar.`;
  return (
    <HintTooltip content={hint}>
      <div className="flex flex-col">
        <Chip color={color} variant="soft" size="sm">
          <Chip.Label>{days === 0 ? "Hari ini" : `${days} hari`}</Chip.Label>
        </Chip>
        <span className="mt-0.5 text-xs text-muted">
          {formatDateTimeShort(since ?? "")}
        </span>
      </div>
    </HintTooltip>
  );
}

function RemindedCell({ tx }: { tx: IPosTransaction }) {
  if (!tx.remindedAt) {
    return (
      <HintTooltip content="Pelanggan ini belum pernah diingatkan dari Portal.">
        <span className="text-sm text-muted">Belum pernah</span>
      </HintTooltip>
    );
  }
  const count = tx.reminderCount ?? 1;
  return (
    <HintTooltip
      content={`Terakhir ${formatDateTimeShort(
        tx.remindedAt
      )}, total ${count}x diingatkan. Dicatat saat WhatsApp dibuka, pastikan pesannya benar-benar terkirim.`}
    >
      <div className="flex items-center gap-1.5 text-sm">
        <Icon icon="mdi:check-all" className="h-4 w-4 text-success" />
        <span>
          {relativeDays(tx.remindedAt)}
          {(tx.reminderCount ?? 0) > 1 && (
            <span className="text-muted"> · {tx.reminderCount}×</span>
          )}
        </span>
      </div>
    </HintTooltip>
  );
}

const remindedExport = {
  title: "Terakhir Diingatkan",
  format: "datetime" as const,
  value: (tx: IPosTransaction) => tx.remindedAt,
};

export function reminderColumns(
  kind: ReminderKind
): ColumnTable<IPosTransaction>[] {
  const waitingSince = (tx: IPosTransaction) =>
    kind === "pickup" ? tx.readyAt ?? tx.estimatedCompletionAt : tx.createdAt;

  return [
    { key: "invoiceNumber", title: "No. Invoice" },
    {
      key: "customerName",
      title: "Pelanggan",
      tooltip:
        "Nama dan No. HP dari data pelanggan terbaru. Tanpa No. HP, tombol Ingatkan tidak bisa dipakai. Tambahkan nomornya di menu Pelanggan.",
      render: (tx) => <CustomerCell tx={tx} />,
    },
    {
      key: kind === "pickup" ? "readyAt" : "createdAt",
      title: kind === "pickup" ? "Siap Sejak" : "Order Sejak",
      tooltip:
        kind === "pickup"
          ? "Sejak kapan cucian berstatus Siap Diambil. Kuning = 3 hari atau lebih, merah = 7 hari atau lebih."
          : "Tanggal order dibuat. Kuning = 3 hari atau lebih, merah = 7 hari atau lebih.",
      export: { format: "datetime", value: waitingSince },
      render: (tx) => <WaitingCell since={waitingSince(tx)} kind={kind} />,
    },
    kind === "pickup"
      ? {
          key: "paymentStatus",
          title: "Pembayaran",
          tooltip:
            "Kalau belum lunas, pesan pengingat ikut menyebut jumlah tagihan.",
          export: {
            value: (tx) =>
              tx.paymentStatus === "paid" ? "Lunas" : "Belum Bayar",
          },
          render: (tx) => (
            <PaymentStatusChip status={tx.paymentStatus} size="sm" />
          ),
        }
      : {
          key: "status",
          title: "Status",
          tooltip:
            "Tahap cucian saat ini. Order yang sudah Siap Diambil juga muncul di tab Siap Diambil.",
          export: false,
          render: (tx) => <StatusChip status={tx.status} size="sm" />,
        },
    {
      key: "total",
      title: kind === "pickup" ? "Total" : "Tagihan",
      tooltip:
        kind === "pickup"
          ? "Total nilai order."
          : "Jumlah yang belum dibayar pelanggan.",
      export: { format: "currency" },
      render: (tx) => formatIDR(tx.total),
    },
    {
      key: "remindedAt",
      title: "Terakhir Diingatkan",
      tooltip:
        "Terisi otomatis saat kamu klik Ingatkan. Order siap diambil yang 2 hari belum diingatkan dihitung di badge sidebar.",
      export: remindedExport,
      render: (tx) => <RemindedCell tx={tx} />,
    },
  ];
}
