import { createContext, use } from "react";
import { cn } from "@heroui/react";

import { useRecordCount } from "@hooks/useRecordCount";

export type BadgeTone = "warning" | "danger" | "accent";

export interface SidebarBadge {
  count: number;
  tone: BadgeTone;
}

/** Counts keyed by resource name (the menu item's `name`). */
export type SidebarBadges = Record<string, SidebarBadge>;

const SidebarBadgesContext = createContext<SidebarBadges>({});

export const SidebarBadgesProvider = SidebarBadgesContext.Provider;

export function useSidebarBadge(name: string): SidebarBadge | undefined {
  return use(SidebarBadgesContext)[name];
}

/** Sum of the badges below a group, shown on the group while it is closed. */
export function useGroupBadge(leafNames: string[]): SidebarBadge | undefined {
  const badges = use(SidebarBadgesContext);
  const found = leafNames.map((n) => badges[n]).filter((b): b is SidebarBadge => !!b);
  if (found.length === 0) return undefined;
  const order: BadgeTone[] = ["danger", "warning", "accent"];
  return {
    count: found.reduce((sum, b) => sum + b.count, 0),
    tone: order.find((t) => found.some((b) => b.tone === t)) ?? "accent",
  };
}

/**
 * Work waiting in the POS. Only polled while the POS app is open in the
 * sidebar; a zero count shows no badge.
 */
export function usePosSidebarBadges(enabled: boolean): SidebarBadges {
  const unpaid = useRecordCount(
    "pos-transactions",
    [{ field: "outstanding", operator: "eq", value: true }],
    { enabled },
  );
  const dueReminders = useRecordCount(
    "pos-transactions",
    [{ field: "dueReminder", operator: "eq", value: true }],
    { enabled },
  );

  const badges: SidebarBadges = {};
  if (unpaid) badges["pos-unpaid-transactions"] = { count: unpaid, tone: "warning" };
  if (dueReminders) badges["pos-reminders"] = { count: dueReminders, tone: "accent" };
  return badges;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  warning: "bg-warning text-warning-foreground",
  danger: "bg-danger text-danger-foreground",
  accent: "bg-accent text-accent-foreground",
};

export function CountBadge({
  badge,
  className,
}: {
  badge: SidebarBadge;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full px-1.5 text-xs font-semibold tabular-nums",
        TONE_CLASS[badge.tone],
        className,
      )}
      aria-label={`${badge.count} perlu ditindaklanjuti`}
    >
      {badge.count > 99 ? "99+" : badge.count}
    </span>
  );
}

/** Small dot on an icon in the collapsed (icon-only) sidebar. */
export function BadgeDot({ badge }: { badge: SidebarBadge }) {
  return (
    <span
      className={cn(
        "absolute right-1 top-1 size-2 rounded-full ring-2 ring-surface",
        TONE_CLASS[badge.tone],
      )}
      aria-hidden
    />
  );
}
