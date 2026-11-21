import { Icon } from "@iconify/react";
import type { CustomRowActionButton } from "@components/table/types";
import { useDataProvider, useNotification } from "@refinedev/core";
import { useState } from "react";
import type { IPosCustomer } from "@features/pos/customers/interfaces";
import { formatIDR, STATUS_CONFIG } from "./config";
import type { IPosTransaction } from "./interfaces";

// Same wording as the POS app (dolphin_pos ReceiptTextBuilder.buildStatusUpdate),
// so customers get identical messages whether they come from the cashier or the portal.
export const STORE_NAME = "Dolphin Laundry";

/** Indonesian number → wa.me form (628xx, no "+"). Returns "" when there are no digits. */
export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return `62${digits}`;
}

function formatDateTime(value: string) {
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function buildStatusUpdateMessage(tx: IPosTransaction) {
  const isReady = tx.status === "ready";
  const lines = [
    `Halo *${tx.customerName}*,`,
    isReady
      ? `Laundry kamu di ${STORE_NAME} sudah *siap diambil* ✅`
      : `Kabar laundry kamu di ${STORE_NAME}:`,
    "",
    `Nomor Nota : *${tx.invoiceNumber}*`,
    `Status     : ${STATUS_CONFIG[tx.status]?.label ?? tx.status}`,
  ];
  if (!isReady && tx.estimatedCompletionAt) {
    lines.push(`Estimasi   : ${formatDateTime(tx.estimatedCompletionAt)}`);
  }
  lines.push(
    tx.paymentStatus === "paid"
      ? "Pembayaran : LUNAS"
      : `Tagihan    : *${formatIDR(tx.total)}* (bayar saat ambil)`,
    "",
  );
  if (isReady) {
    lines.push("Tunjukkan nota ini atau sebutkan no. HP terdaftar saat mengambil.", "");
  }
  lines.push("Terima kasih telah menggunakan layanan kami!");
  return lines.join("\n");
}

/** WhatsApp only makes sense for a registered customer on a live order. */
export function canSendWhatsApp(tx: IPosTransaction) {
  return !!tx.customerId && tx.status !== "cancelled";
}

/**
 * Opens a wa.me chat with the order's status update prefilled. The phone is
 * not on the transaction, so it is looked up from the customer first. There
 * is no gateway: the admin still taps send in WhatsApp.
 */
export function useSendOrderWhatsApp() {
  const getDataProvider = useDataProvider();
  const { open: notify } = useNotification();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const send = async (tx: IPosTransaction) => {
    if (!tx.customerId || pendingId) return;

    // Open the tab synchronously (inside the click) so popup blockers allow it,
    // then point it at wa.me once the phone is known.
    const win = window.open("", "_blank");
    setPendingId(tx.id);
    try {
      // Lists include the phone; older API builds and the detail page may not.
      let rawPhone = tx.customerPhone;
      if (rawPhone === undefined) {
        const { data: customer } = await getDataProvider().getOne<IPosCustomer>({
          resource: "pos-customers",
          id: tx.customerId,
        });
        rawPhone = customer.phone;
      }
      const phone = normalizePhone(rawPhone ?? "");
      if (!phone) {
        win?.close();
        notify?.({
          type: "error",
          message: `${tx.customerName} belum punya nomor WhatsApp.`,
        });
        return;
      }
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildStatusUpdateMessage(tx))}`;
      if (win) {
        win.opener = null;
        win.location.href = url;
      } else {
        window.location.assign(url);
      }
    } catch {
      win?.close();
      notify?.({ type: "error", message: "Gagal mengambil nomor pelanggan." });
    } finally {
      setPendingId(null);
    }
  };

  return { send, pendingId };
}

/** Row button for the transaction tables: opens WhatsApp with the status update. */
export function useWhatsAppRowAction(): CustomRowActionButton<IPosTransaction> {
  const { send, pendingId } = useSendOrderWhatsApp();
  return {
    key: "whatsapp",
    label: "WhatsApp",
    ariaLabel: "Kirim status order via WhatsApp",
    variant: "secondary",
    icon: <Icon icon="mdi:whatsapp" width={16} className="text-success" />,
    onPress: send,
    isVisible: canSendWhatsApp,
    isDisabled: (tx) => pendingId === tx.id,
  };
}
