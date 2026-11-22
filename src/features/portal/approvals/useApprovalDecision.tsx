import { Icon } from "@iconify/react";
import { useCustomMutation, useInvalidate, type HttpError } from "@refinedev/core";
import { useState } from "react";

import type { CustomRowActionButton } from "@components/table/types";
import { APPROVALS_RESOURCE, approvalActionLabel, type IApproval } from "./interfaces";

type Decision = "approved" | "rejected";

function errorMessage(error?: HttpError): string {
  if (error?.statusCode === 409) {
    return "Permintaan ini sudah tidak berlaku: kedaluwarsa, dibatalkan kasir, atau sudah dijawab admin lain.";
  }
  if (error?.statusCode === 403) {
    return "Akun kamu tidak boleh menyetujui permintaan ini.";
  }
  return "Gagal menyimpan keputusan. Coba lagi.";
}

/**
 * Approves or rejects a POS request. The cashier's tablet polls the request
 * and continues (or stops) on its own within a few seconds.
 */
export function useApprovalDecision() {
  const invalidate = useInvalidate();
  const { mutate } = useCustomMutation();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const decide = (item: IApproval, status: Decision) => {
    if (pendingId) return;
    setPendingId(item.id);
    const what = approvalActionLabel(item.action).toLowerCase();
    mutate(
      {
        url: `${APPROVALS_RESOURCE}/${item.id}/decision`,
        method: "patch",
        values: { status },
        successNotification: {
          type: "success",
          message:
            status === "approved"
              ? `${item.requestedByName} boleh ${what}.`
              : `Permintaan ${item.requestedByName} ditolak.`,
        },
        errorNotification: (error) => ({ type: "error", message: errorMessage(error) }),
      },
      {
        // Refresh on failure too: a 409 means the list is out of date.
        onSettled: () => {
          setPendingId(null);
          invalidate({ resource: APPROVALS_RESOURCE, invalidates: ["list"] });
        },
      },
    );
  };

  return { decide, pendingId };
}

/** Setujui / Tolak buttons for the approvals table, only on pending rows. */
export function useApprovalRowActions(): CustomRowActionButton<IApproval>[] {
  const { decide, pendingId } = useApprovalDecision();
  const isPending = (item: IApproval) => item.status === "pending";
  return [
    {
      key: "approve",
      label: "Setujui",
      ariaLabel: "Setujui permintaan",
      variant: "primary",
      icon: <Icon icon="mdi:check" width={16} />,
      onPress: (item) => decide(item, "approved"),
      isVisible: isPending,
      isDisabled: () => pendingId !== null,
      tooltip: (item) => `Izinkan ${item.requestedByName}: ${approvalActionLabel(item.action).toLowerCase()}`,
    },
    {
      key: "reject",
      label: "Tolak",
      ariaLabel: "Tolak permintaan",
      variant: "danger",
      icon: <Icon icon="mdi:close" width={16} />,
      onPress: (item) => decide(item, "rejected"),
      isVisible: isPending,
      isDisabled: () => pendingId !== null,
    },
  ];
}
