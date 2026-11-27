import { useEffect, useRef } from "react";
import { RealtimeClient, type RealtimeChannel } from "@supabase/realtime-js";

// Supabase Realtime, used only to hear "something changed" signals sent by
// dolphin-api, so pages refetch on demand instead of polling. Signals carry
// no data; the refetch goes through the API, which checks the user.
//
// The publishable key is public by design (same one the POS ships with).
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://aijtiikflqhamvpvkhmb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_TIel-I392-7tfcNwaTOU3A_bJ8OFRx1";

let client: RealtimeClient | null = null;

/** One websocket for the whole portal, opened on first use. */
function realtimeClient(): RealtimeClient {
  client ??= new RealtimeClient(`${SUPABASE_URL}/realtime/v1`, {
    params: { apikey: SUPABASE_PUBLISHABLE_KEY },
  });
  return client;
}

/**
 * Calls `onSignal` whenever `event` is broadcast on `topic`, and again after
 * every reconnect (signals sent while offline are lost, so catch up).
 */
export function useBroadcastSignal(
  topic: string,
  event: string,
  onSignal: () => void,
  enabled = true,
) {
  const callback = useRef(onSignal);
  useEffect(() => {
    callback.current = onSignal;
  });

  useEffect(() => {
    if (!enabled) return;
    const rt = realtimeClient();
    let joinedBefore = false;
    const channel: RealtimeChannel = rt
      .channel(topic)
      .on("broadcast", { event }, () => callback.current())
      .subscribe((status) => {
        if (status !== "SUBSCRIBED") return;
        if (joinedBefore) callback.current();
        joinedBefore = true;
      });
    return () => {
      void rt.removeChannel(channel);
    };
  }, [topic, event, enabled]);
}
