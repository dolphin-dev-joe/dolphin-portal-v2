import { useCallback } from "react";
import { useNotification } from "@refinedev/core";

/** Copies text and shows a toast with the result. */
export function useCopyToClipboard() {
  const { open } = useNotification();

  return useCallback(
    async (text: string, successMessage = "Disalin ke clipboard") => {
      try {
        await navigator.clipboard.writeText(text);
        open?.({ type: "success", message: successMessage });
      } catch {
        open?.({ type: "error", message: "Gagal menyalin. Salin manual ya." });
      }
    },
    [open],
  );
}
