import { useEffect, useRef } from "react";
import { useInvalidate } from "@refinedev/core";

import { useBroadcastSignal } from "@lib/realtime";

/** Sent by the POS database trigger (dolphin-api migration 0012). */
const TOPIC = "pos-transactions";
const EVENT = "transactions_changed";

/** A bulk move on a tablet sends a burst of signals; refetch once. */
const DEBOUNCE_MS = 1_000;

/**
 * Keeps every POS transaction list (tables, sidebar badges, reminder counts)
 * current without polling: when an order is created or changed on a tablet
 * or in the portal, the open lists refetch. Lists that are not on screen are
 * only marked stale. Mount once, in the layout.
 */
export function usePosTransactionsLive(enabled = true) {
  const invalidate = useInvalidate();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useBroadcastSignal(
    TOPIC,
    EVENT,
    () => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(
        () => invalidate({ resource: "pos-transactions", invalidates: ["list", "many", "detail"] }),
        DEBOUNCE_MS,
      );
    },
    enabled,
  );
}
