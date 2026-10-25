import { useEffect, useMemo } from "react";
import { useSelect } from "@refinedev/core";
import { useLookupOptions } from "@/contexts/lookupOptions";
import type { SelectItemType } from "@/interfaces/common";

interface CreateSelectHookProps {
  /** Unique key for caching options in lookup state. */
  key: string;
  /** API resource name (e.g. `"perfume-categories"`). */
  resource: string;
  /** Field name used as the option label (e.g. `"name"`). */
  optionLabel: string;
  /** Field name used as the option value. Defaults to `"id"`. */
  optionValue?: string;
  /** Number of items to fetch per page. Defaults to `100`. */
  pageSize?: number;
}

/**
 * Factory for creating cached select-options hooks.
 *
 * Wraps Refine's `useSelect` and persists the result in the
 * lookup options context so subsequent calls with the same key
 * skip the network request entirely.
 *
 * @example
 * const usePerfumeCategoryOptions = createSelectHook({
 *   key: "perfume-categories",
 *   resource: "perfume-categories",
 *   optionLabel: "name",
 *   optionValue: "id",
 * });
 *
 * // In a component:
 * const { options, isLoading } = usePerfumeCategoryOptions();
 */
export function createSelectHook({
  key,
  resource,
  optionLabel,
  optionValue = "id",
  pageSize = 100,
}: CreateSelectHookProps) {
  return function useOptions(useForFilter: boolean = false) {
    const { getLookupOptions, setLookupOptions } = useLookupOptions();
    const cached = getLookupOptions(key);

    const { options: rawOptions, query } = useSelect({
      resource,
      // Accessor functions: with BaseRecord, `keyof` widens to string | number,
      // which Refine's field-name overload rejects.
      optionLabel: (item) => String(item[optionLabel] ?? ""),
      optionValue: (item) => String(item[optionValue] ?? ""),
      pagination: { mode: "server", pageSize },
      queryOptions: {
        enabled: !cached,
        staleTime: 86400000, // 24h — same as createOptionsHook
      },
    });

    // Cache mapped options in lookup context once they arrive.
    useEffect(() => {
      if (cached || !rawOptions || rawOptions.length === 0) return;

      const mapped: SelectItemType[] = rawOptions.map((opt) => ({
        key: String(opt.value),
        value: String(opt.value),
        label: String(opt.label),
        text: String(opt.label),
      }));

      setLookupOptions(key, mapped);
    }, [rawOptions, cached, setLookupOptions]);

    const finalOptions = useMemo(() => {
      const opts = cached ?? [];

      if (!useForFilter) return opts;

      const hasAll = opts.some((opt) => opt.value === "all");
      if (hasAll) {
        return [...opts].sort((a, b) =>
          a.value === "all" ? -1 : b.value === "all" ? 1 : 0,
        );
      }
      return [
        { key: "all", label: "All", value: "all", text: "All" },
        ...opts,
      ];
    }, [cached, useForFilter]);

    return {
      options: finalOptions,
      isLoading: query.isLoading,
      query,
    };
  };
}
