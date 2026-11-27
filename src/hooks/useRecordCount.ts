import { useList, type CrudFilters } from "@refinedev/core";

/**
 * Total number of records matching `filters`, fetched with a single-row page.
 * Shares the resource's list cache, so it refreshes whenever that resource
 * is invalidated: after an action in the portal, or on a Realtime signal
 * (see usePosTransactionsLive). No polling.
 */
export function useRecordCount(
  resource: string,
  filters: CrudFilters,
  { enabled = true }: { enabled?: boolean } = {},
): number | undefined {
  const { result } = useList({
    resource,
    filters,
    pagination: { currentPage: 1, pageSize: 1 },
    errorNotification: false,
    queryOptions: { enabled, refetchOnWindowFocus: true },
  });
  return enabled ? result?.total : undefined;
}
