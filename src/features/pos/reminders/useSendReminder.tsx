import { Icon } from "@iconify/react";
import {
  useCustomMutation,
  useInvalidate,
  useNotification,
} from "@refinedev/core";
import { useState } from "react";

import type { CustomRowActionButton } from "@components/table/types";
import type { IPosTransaction } from "@features/pos/transactions/interfaces";
import { normalizePhone } from "@features/pos/transactions/whatsapp";
import { buildReminder, type ReminderKind } from "./messages";

/**
 * Opens WhatsApp with the reminder prefilled and records it on the order
 * (remindedAt / reminderCount), so the next admin sees it was done. There is
 * no gateway: the admin still taps send in WhatsApp.
 */
export function useSendReminder(kind: ReminderKind) {
  const { open: notify } = useNotification();
  const invalidate = useInvalidate();
  const { mutate: markReminded } = useCustomMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const send = (tx: IPosTransaction) => {
    const phone = normalizePhone(tx.customerPhone ?? "");
    if (!phone) {
      notify?.({
        type: "error",
        message: `${tx.customerName} belum punya nomor WhatsApp.`,
      });
      return;
    }

    // Opened inside the click so popup blockers allow it.
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(
      buildReminder(kind, tx)
    )}`;
    // No "noopener" feature: with it window.open always returns null and we
    // couldn't tell a blocked popup apart. Cut the link by hand instead.
    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.assign(url);

    setPendingId(tx.id);
    markReminded(
      {
        url: `pos/transactions/${tx.id}/reminded`,
        method: "patch",
        values: {},
        successNotification: false,
        errorNotification: {
          type: "error",
          message: "WhatsApp terbuka, tapi gagal menandai sudah diingatkan.",
        },
      },
      {
        onSuccess: () =>
          invalidate({ resource: "pos-transactions", invalidates: ["list"] }),
        onSettled: () => setPendingId(null),
      }
    );
  };

  return { send, pendingId };
}

export function useReminderRowAction(
  kind: ReminderKind
): CustomRowActionButton<IPosTransaction> {
  const { send, pendingId } = useSendReminder(kind);
  return {
    key: `remind-${kind}`,
    label: "Ingatkan",
    ariaLabel:
      kind === "pickup"
        ? "Ingatkan ambil laundry via WhatsApp"
        : "Ingatkan tagihan via WhatsApp",
    variant: "secondary",
    icon: <Icon icon="mdi:whatsapp" width={16} className="text-success" />,
    onPress: send,
    isVisible: (tx) => !!tx.customerId,
    isDisabled: (tx) =>
      pendingId === tx.id || !normalizePhone(tx.customerPhone ?? ""),
    tooltip: (tx) => {
      if (pendingId === tx.id) return "Mencatat pengingat...";
      if (!normalizePhone(tx.customerPhone ?? "")) {
        return `${tx.customerName} belum punya No. HP. Tambahkan di menu Pelanggan dulu.`;
      }
      const what =
        kind === "pickup"
          ? "laundry siap diambil"
          : "tagihan yang belum dibayar";
      return `Buka WhatsApp ke ${tx.customerPhone} dengan pesan pengingat ${what}. Tinggal tekan kirim.`;
    },
  };
}
