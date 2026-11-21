import { useList, type CrudFilters } from "@refinedev/core";

/**
 * Total number of records matching `filters`, fetched with a single-row page.
 * Shares the resource's list cache, so it refreshes whenever that resource
 * is invalidated (e.g. after recording a payment), and polls in between.
 */
export function useRecordCount(
  resource: string,
  filters: CrudFilters,
  { enabled = true, refetchInterval = 60_000 }: { enabled?: boolean; refetchInterval?: number } = {},
): number | undefined {
  const { result } = useList({
    resource,
    filters,
    pagination: { currentPage: 1, pageSize: 1 },
    errorNotification: false,
    queryOptions: { enabled, refetchInterval, refetchOnWindowFocus: true },
  });
  return enabled ? result?.total : undefined;
}
