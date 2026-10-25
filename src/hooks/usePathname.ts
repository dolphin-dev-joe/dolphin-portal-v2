import { useLocation } from "react-router";

/** Drop-in replacement for Next.js `usePathname()`. */
export function usePathname(): string {
  return useLocation().pathname;
}
