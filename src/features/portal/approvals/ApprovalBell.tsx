import { useEffect, useRef } from "react";
import { Button, Tooltip, cn } from "@heroui/react";
import { Icon } from "@iconify/react";
import { useGetIdentity, useInvalidate, useList, useNotification } from "@refinedev/core";
import { useNavigate } from "react-router";

import { CountBadge } from "@components/layout/sidebarBadges";
import type { AuthUser } from "@lib/authStorage";
import { useBroadcastSignal } from "@lib/realtime";
import {
  APPROVALS_RESOURCE,
  APPROVER_ROLES,
  approvalActionLabel,
  type IApproval,
} from "./interfaces";

export const APPROVALS_PATH = "/approvals";

/** Realtime signal sent by dolphin-api (identity.ApprovalsTopic/Event). */
const APPROVALS_TOPIC = "portal-approvals";
const APPROVALS_EVENT = "approvals_changed";

function canUseBrowserNotifications(): boolean {
  return typeof window !== "undefined" && "Notification" in window;
}

/**
 * Header bell for admins: number of POS requests waiting for approval, a
 * toast when a new one arrives, and a browser notification when the portal
 * tab is in the background (if the admin allowed it). Renders nothing for
 * roles that can't approve.
 *
 * No polling: the API broadcasts a Realtime signal whenever a request is
 * created, cancelled or decided, and the bell (plus the approvals page)
 * refetches then. It also refetches when the tab regains focus, after a
 * reconnect, and once when the oldest waiting request expires.
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
      refetchOnWindowFocus: true,
    },
  });

  const { open: notify } = useNotification();
  const invalidate = useInvalidate();
  const navigate = useNavigate();
  const seen = useRef<Set<string> | null>(null);

  // Refreshes this bell and the approvals page (every approvals list).
  const refresh = () => invalidate({ resource: APPROVALS_RESOURCE, invalidates: ["list"] });
  useBroadcastSignal(APPROVALS_TOPIC, APPROVALS_EVENT, refresh, canApprove);

  const pending = result?.data ?? [];
  const count = result?.total ?? 0;
  const idsKey = pending.map((a) => a.id).join(",");

  // An expiring request sends no signal: refetch once when the oldest is due.
  const nextExpiry = pending.reduce<number | null>((min, a) => {
    const t = Date.parse(a.expiresAt);
    return Number.isNaN(t) ? min : min === null ? t : Math.min(min, t);
  }, null);
  useEffect(() => {
    if (nextExpiry === null) return;
    const timer = window.setTimeout(refresh, Math.max(nextExpiry - Date.now(), 0) + 1_000);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextExpiry]);

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
