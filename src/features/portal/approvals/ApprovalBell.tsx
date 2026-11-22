import { useEffect, useRef } from "react";
import { Button, Tooltip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useGetIdentity, useInvalidate, useList, useNotification } from "@refinedev/core";
import { useNavigate } from "react-router";

import { CountBadge } from "@components/layout/sidebarBadges";
import type { AuthUser } from "@lib/authStorage";
import {
  APPROVALS_RESOURCE,
  APPROVER_ROLES,
  approvalActionLabel,
  type IApproval,
} from "./interfaces";

/** A cashier is waiting at the tablet, so check often. */
const POLL_MS = 5_000;
export const APPROVALS_PATH = "/approvals";

function canUseBrowserNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Header bell for admins: number of POS requests waiting for approval, a
 * toast when a new one arrives, and a browser notification when the portal
 * tab is in the background (if the admin allowed it). Renders nothing for
 * roles that can't approve.
 */
export function ApprovalBell() {
  const { data: identity } = useGetIdentity<AuthUser>();
  const canApprove = APPROVER_ROLES.includes(identity?.role ?? "");

  const { result } = useList<IApproval>({
    resource: APPROVALS_RESOURCE,
    filters: [{ field: "status", operator: "eq", value: "pending" }],
    sorters: [{ field: "createdAt", order: "desc" }],
    pagination: { currentPage: 1, pageSize: 20 },
    errorNotification: false,
    queryOptions: {
      enabled: canApprove,
      refetchInterval: POLL_MS,
      refetchIntervalInBackground: true,
      refetchOnWindowFocus: true,
    },
  });

  const { open: notify } = useNotification();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const seen = useRef<Set<string> | null>(null);

  const pending = result?.data ?? [];
  const count = result?.total ?? 0;
  const idsKey = pending.map((a) => a.id).join(",");

  useEffect(() => {
    if (!canApprove || !result) return;
    const ids = new Set(pending.map((a) => a.id));
    const previous = seen.current;
    seen.current = ids;
    // First load: requests already waiting get one toast, nothing more.
    const fresh = pending.filter((a) => !previous?.has(a.id));
    for (const a of fresh) {
      const where = a.deviceName ? ` · ${a.deviceName}` : "";
      notify?.({
        key: `approval-${a.id}`,
        type: "progress",
        message: `${a.requestedByName} minta persetujuan`,
        description: `${approvalActionLabel(a.action)}${where}. Buka lonceng di atas untuk menjawab.`,
      });
      if (document.hidden && canUseBrowserNotifications() && Notification.permission === "granted") {
        new Notification("Dolphin POS: butuh persetujuan", {
          body: `${a.requestedByName}: ${approvalActionLabel(a.action)}${where}`,
          tag: `approval-${a.id}`,
        });
      }
    }
    // Keep the approvals page in step when the waiting list changes.
    if (previous && (fresh.length > 0 || previous.size !== ids.size)) {
      invalidate({ resource: APPROVALS_RESOURCE, invalidates: ["list"] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canApprove, idsKey]);

  if (!canApprove) return null;

  const openApprovals = () => {
    // Asking inside a click is what browsers allow; only asked once.
    if (canUseBrowserNotifications() && Notification.permission === "default") {
      void Notification.requestPermission();
    }
    navigate(APPROVALS_PATH);
  };

  const label =
    count > 0 ? `${count} permintaan persetujuan dari kasir` : "Tidak ada permintaan persetujuan";

  return (
    <Tooltip>
      <Tooltip.Trigger>
        <span className="relative inline-flex">
          <Button
            isIconOnly
            variant="ghost"
            onPress={openApprovals}
            className={cn(
              "rounded-xl border border-divider/60 bg-surface/40",
              "text-muted-foreground hover:text-foreground hover:bg-default-100/70",
              count > 0 && "text-warning",
            )}
            aria-label={label}
          >
            <Icon icon={count > 0 ? "lucide:bell-ring" : "lucide:bell"} className="h-5 w-5" />
          </Button>
          {count > 0 && (
            <CountBadge
              badge={{ count, tone: "warning" }}
              className="pointer-events-none absolute -right-1.5 -top-1.5"
            />
          )}
        </span>
      </Tooltip.Trigger>
      <Tooltip.Content placement="bottom">{label}</Tooltip.Content>
    </Tooltip>
  );
}
