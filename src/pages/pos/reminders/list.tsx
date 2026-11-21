import { useState } from "react";
import { Tabs, Typography } from "@heroui/react";
import { Icon } from "@iconify/react";

import DataTable from "@components/table";
import { ActionButton } from "@components/table/types";
import { Heading } from "@/components/heading";
import { reminderColumns } from "@features/pos/reminders/columns";
import type { ReminderKind } from "@features/pos/reminders/messages";
import { useReminderRowAction } from "@features/pos/reminders/useSendReminder";
import type { IPosTransaction } from "@features/pos/transactions/interfaces";
import { useRecordCount } from "@hooks/useRecordCount";
import { HintTooltip, InfoTooltip } from "@components/table/TableTooltip";

const TABS: Record<
  ReminderKind,
  {
    label: string;
    icon: string;
    description: string;
    filter: { field: string; value: string | boolean };
    sortField: string;
    fileName: string;
    tooltip: (count: number | undefined) => string;
  }
> = {
  pickup: {
    label: "Siap Diambil",
    icon: "mdi:bag-checked",
    description:
      "Laundry yang sudah selesai tapi belum diambil, paling lama menunggu di atas. Klik Ingatkan untuk membuka WhatsApp dengan pesan siap kirim.",
    filter: { field: "status", value: "ready" },
    sortField: "readyAt",
    fileName: "pengingat-siap-diambil",
    tooltip: (n) =>
      `${n ?? "..."} order sudah selesai dicuci tapi belum diambil pelanggan.`,
  },
  payment: {
    label: "Belum Dibayar",
    icon: "mdi:cash-clock",
    description:
      "Order yang belum lunas (bayar saat ambil), paling lama di atas. Pesan berisi nomor nota dan jumlah tagihan.",
    filter: { field: "outstanding", value: true },
    sortField: "createdAt",
    fileName: "pengingat-belum-dibayar",
    tooltip: (n) =>
      `${
        n ?? "..."
      } order belum lunas (bayar saat ambil), termasuk yang masih dicuci.`,
  },
};

function ReminderTable({ kind }: { kind: ReminderKind }) {
  const tab = TABS[kind];
  const remindAction = useReminderRowAction(kind);
  return (
    <DataTable<IPosTransaction>
      resource="pos-transactions"
      description={tab.description}
      columns={reminderColumns(kind)}
      withSearch
      permanentFilters={[tab.filter]}
      sorters={[{ field: tab.sortField, order: "asc" }]}
      actionColumns={[ActionButton.Show]}
      customRowActionButtons={[remindAction]}
      exportOptions={{
        fileName: tab.fileName,
        title: `Pengingat — ${tab.label}`,
        extraColumns: [
          { key: "customerPhone", title: "No. HP" },
          {
            key: "reminderCount",
            title: "Jumlah Diingatkan",
            format: "number",
          },
        ],
      }}
    />
  );
}

export default function PosRemindersPage() {
  const [selected, setSelected] = useState<ReminderKind>("pickup");
  const counts: Record<ReminderKind, number | undefined> = {
    pickup: useRecordCount("pos-transactions", [
      { field: "status", operator: "eq", value: "ready" },
    ]),
    payment: useRecordCount("pos-transactions", [
      { field: "outstanding", operator: "eq", value: true },
    ]),
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Heading className="text-xl font-semibold">
            Pengingat WhatsApp
          </Heading>
          <InfoTooltip
            content={
              <>
                <strong>Cara pakai:</strong> pilih tab, lalu klik{" "}
                <em>Ingatkan</em> di baris pelanggan. WhatsApp terbuka dengan
                pesan siap kirim, tekan kirim di WhatsApp, dan order otomatis
                ditandai sudah diingatkan. Tidak ada pesan yang terkirim
                sendiri.
              </>
            }
          />
        </div>
        <Typography type="body-sm" color="muted" className="mt-1">
          Ingatkan pelanggan untuk mengambil laundry atau melunasi tagihan.
          WhatsApp terbuka dengan pesan terisi; kamu tinggal tekan kirim, dan
          order ditandai sudah diingatkan.
        </Typography>
      </div>

      <Tabs
        selectedKey={selected}
        onSelectionChange={(key) => setSelected(key as ReminderKind)}
      >
        <Tabs.ListContainer>
          <Tabs.List aria-label="Jenis pengingat">
            {(Object.keys(TABS) as ReminderKind[]).map((kind, index) => (
              <Tabs.Tab key={kind} id={kind}>
                {index > 0 && <Tabs.Separator />}
                <HintTooltip
                  content={TABS[kind].tooltip(counts[kind])}
                  placement="bottom"
                >
                  <span className="flex items-center gap-2">
                    <Icon icon={TABS[kind].icon} className="h-4 w-4" />
                    {TABS[kind].label}
                    {counts[kind] !== undefined && (
                      <span className="rounded-full bg-default px-2 py-0.5 text-xs font-semibold tabular-nums">
                        {counts[kind]}
                      </span>
                    )}
                  </span>
                </HintTooltip>
                <Tabs.Indicator />
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs.ListContainer>
        {(Object.keys(TABS) as ReminderKind[]).map((kind) => (
          <Tabs.Panel key={kind} id={kind} className="pt-4">
            <ReminderTable kind={kind} />
          </Tabs.Panel>
        ))}
      </Tabs>
    </div>
  );
}
