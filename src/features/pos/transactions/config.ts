// Konfigurasi terpusat untuk fitur Transaksi POS.
// Dipakai oleh columns (list), StatusChip, dan halaman detail.

export type StatusChipColor = "default" | "accent" | "success" | "warning" | "danger";

export function formatIDR(value: string | number) {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export const PAYMENT_LABELS: Record<string, string> = {
  cash: "Tunai",
  transfer: "Transfer",
  qris: "QRIS",
};

export interface StatusConfig {
  label: string;
  color: StatusChipColor;
  icon: string;
}

export const STATUS_CONFIG: Record<string, StatusConfig> = {
  pending:    { label: "Masuk",         color: "accent",  icon: "mdi:clock-outline" },
  processing: { label: "Sedang Dicuci", color: "warning", icon: "mdi:washing-machine" },
  ready:      { label: "Siap Diambil",  color: "success", icon: "mdi:check-circle-outline" },
  picked_up:  { label: "Sudah Diambil", color: "default", icon: "mdi:bag-checked" },
  cancelled:  { label: "Dibatalkan",    color: "danger",  icon: "mdi:close-circle-outline" },
  completed:  { label: "Selesai",       color: "success", icon: "mdi:check-circle" },
};

export const FALLBACK_STATUS: StatusConfig = {
  label: "-",
  color: "default",
  icon: "mdi:help-circle-outline",
};

// Alur status workflow (linear) untuk update di halaman detail.
export const WORKFLOW = ["pending", "processing", "ready", "picked_up"] as const;
export type WorkflowStatus = (typeof WORKFLOW)[number];

// Label tombol untuk berpindah ke status berikutnya.
export const NEXT_LABEL: Record<string, string> = {
  pending:    "Mulai Proses",
  processing: "Tandai Siap Diambil",
  ready:      "Konfirmasi Sudah Diambil",
};

// Status final yang tidak bisa diubah lagi.
export const TERMINAL_STATUSES = ["picked_up", "cancelled", "completed"];
