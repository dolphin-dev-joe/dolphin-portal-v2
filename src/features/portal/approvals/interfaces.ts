// Admin approval requests from the POS (dolphin-api `/approvals`).
// A cashier asks for an admin-only action; an admin approves it here instead
// of typing their own password on the cashier's tablet.

export type ApprovalStatus = "pending" | "approved" | "rejected" | "cancelled" | "expired";

export interface IApproval {
  id: string;
  action: string;
  requestedBy: string;
  requestedByName: string;
  deviceName: string | null;
  /** "expired" = still pending after expiresAt (computed by the API). */
  status: ApprovalStatus;
  decidedBy: string | null;
  decidedByName: string | null;
  decidedAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

/** Refine resource name; also the API path (`/approvals`). */
export const APPROVALS_RESOURCE = "approvals";

/** Only these roles may see and answer requests (the API checks it too). */
export const APPROVER_ROLES = ["admin", "super_admin"];

export const APPROVAL_ACTION_LABELS: Record<string, string> = {
  printer_settings: "Buka pengaturan printer",
  history_all: "Lihat semua transaksi & omzet",
};

export function approvalActionLabel(action: string): string {
  return APPROVAL_ACTION_LABELS[action] ?? action;
}

type ChipColor = "default" | "accent" | "success" | "warning" | "danger";

export const APPROVAL_STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: ChipColor; icon: string }> = {
  pending: { label: "Menunggu", color: "warning", icon: "mdi:clock-outline" },
  approved: { label: "Disetujui", color: "success", icon: "mdi:check-circle-outline" },
  rejected: { label: "Ditolak", color: "danger", icon: "mdi:close-circle-outline" },
  cancelled: { label: "Dibatalkan kasir", color: "default", icon: "mdi:cancel" },
  expired: { label: "Kedaluwarsa", color: "default", icon: "mdi:timer-off-outline" },
};

export const APPROVAL_STATUS_OPTIONS = (Object.keys(APPROVAL_STATUS_CONFIG) as ApprovalStatus[]).map(
  (value) => ({ label: APPROVAL_STATUS_CONFIG[value].label, value }),
);
