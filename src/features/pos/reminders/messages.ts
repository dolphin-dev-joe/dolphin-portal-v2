import { formatIDR } from "@features/pos/transactions/config";
import type { IPosTransaction } from "@features/pos/transactions/interfaces";
import { STORE_NAME } from "@features/pos/transactions/whatsapp";

export type ReminderKind = "pickup" | "payment";

const pad = (n: number) => String(n).padStart(2, "0");

function formatDay(value: string) {
  const d = new Date(value);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Whole days since `value` (0 = today). */
export function daysSince(value?: string | null): number | null {
  if (!value) return null;
  const start = new Date(value);
  if (Number.isNaN(start.getTime())) return null;
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((today.getTime() - start.getTime()) / 86_400_000));
}

/** "hari ini", "kemarin", "3 hari lalu". */
export function relativeDays(value?: string | null): string {
  const days = daysSince(value);
  if (days === null) return "-";
  if (days === 0) return "hari ini";
  if (days === 1) return "kemarin";
  return `${days} hari lalu`;
}

/** Laundry is ready and waiting at the store. */
export function buildPickupReminder(tx: IPosTransaction) {
  const since = tx.readyAt ?? tx.estimatedCompletionAt;
  const lines = [
    `Halo *${tx.customerName}*,`,
    `Mengingatkan, laundry kamu di ${STORE_NAME} sudah *siap diambil*${since ? ` sejak ${formatDay(since)}` : ""} ✅`,
    "",
    `Nomor Nota : *${tx.invoiceNumber}*`,
    tx.paymentStatus === "paid"
      ? "Pembayaran : LUNAS"
      : `Tagihan    : *${formatIDR(tx.total)}* (bayar saat ambil)`,
    "",
    "Silakan diambil saat sempat ya. Tunjukkan nota ini atau sebutkan no. HP terdaftar.",
    "",
    "Terima kasih telah menggunakan layanan kami!",
  ];
  return lines.join("\n");
}

/** Bill still open (customer chose to pay at pickup). */
export function buildPaymentReminder(tx: IPosTransaction) {
  const lines = [
    `Halo *${tx.customerName}*,`,
    `Kami ingin mengingatkan tagihan laundry kamu di ${STORE_NAME} yang belum dibayar:`,
    "",
    `Nomor Nota : *${tx.invoiceNumber}*`,
    `Tanggal    : ${formatDay(tx.createdAt)}`,
    `Tagihan    : *${formatIDR(tx.total)}*`,
    "",
    "Pembayaran bisa tunai, transfer, atau QRIS saat pengambilan.",
    "Abaikan pesan ini jika sudah membayar.",
    "",
    "Terima kasih!",
  ];
  return lines.join("\n");
}

export function buildReminder(kind: ReminderKind, tx: IPosTransaction) {
  return kind === "pickup" ? buildPickupReminder(tx) : buildPaymentReminder(tx);
}
