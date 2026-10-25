import { useEffect, useMemo, useState } from "react";
import { useList } from "@refinedev/core";
import type { BaseRecord, CrudFilters } from "@refinedev/core";

interface UseDataTableDataOptions {
  resource: string;
  pageSize?: number;
  withPagination?: boolean;
  /** Debounced search text. Sent to the API as the `q` filter. */
  searchValue?: string;
  /** Custom filter selections keyed by field name (e.g. `categoryId`). */
  filterValues?: Record<string, Set<string | boolean>>;
  /**
   * Filters yang selalu dikirim ke API dan tidak bisa diubah user.
   * Berguna untuk halaman yang "mengunci" satu nilai, mis. daftar transaksi
   * yang selalu `status = cancelled`.
   */
  permanentFilters?: { field: string; value: string | boolean }[];
}

interface UseDataTableDataResult<T> {
  rows: T[];
  total: number;
  totalPages: number;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
}

/**
 * Builds Refine `CrudFilters` from the search box and custom filter selections.
 * `"all"` and empty selections are treated as "no filter".
 */
function buildFilters(
  searchValue: string,
  filterValues: Record<string, Set<string | boolean>>,
  permanentFilters: { field: string; value: string | boolean }[] = [],
): CrudFilters {
  const filters: CrudFilters = [];

  for (const pf of permanentFilters) {
    filters.push({ field: pf.field, operator: "eq", value: pf.value });
  }

  if (searchValue.trim()) {
    filters.push({ field: "q", operator: "contains", value: searchValue.trim() });
  }

  for (const [field, set] of Object.entries(filterValues)) {
    const values = Array.from(set ?? []).filter((v) => v !== "all" && v !== "");
    if (values.length === 0) continue;

    if (values.length === 1) {
      filters.push({ field, operator: "eq", value: values[0] });
    } else {
      filters.push({ field, operator: "in", value: values });
    }
  }

  return filters;
}

export function useDataTableData<T extends BaseRecord>({
  resource,
  pageSize = 10,
  withPagination = true,
  searchValue = "",
  filterValues = {},
  permanentFilters = [],
}: UseDataTableDataOptions): UseDataTableDataResult<T> {
  const [page, setPage] = useState(1);

  const permanentKey = JSON.stringify(permanentFilters);
  const filters = useMemo(
    () => buildFilters(searchValue, filterValues, permanentFilters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchValue, filterValues, permanentKey],
  );

  // Reset to first page whenever the active filter set or page size changes, so
  // the user isn't stranded on an out-of-range page after narrowing results.
  const filtersKey = JSON.stringify(filters);
  useEffect(() => {
    setPage(1);
  }, [filtersKey, pageSize]);

  const {
    result: data,
    query: { isLoading, isError },
  } = useList<T>({
    resource,
    filters,
    pagination: withPagination
      ? { currentPage: page, pageSize }
      : { mode: "off" },
  });

  const rows = (data?.data ?? []) as T[];

  // Without pagination, total = number of rows returned, totalPages = 1
  const total = withPagination ? data?.total ?? 0 : rows.length;
  const totalPages = withPagination
    ? Math.max(1, Math.ceil(total / pageSize))
    : 1;

  return {
    rows,
    total,
    totalPages,
    page,
    pageSize,
    setPage,
    isLoading,
    isError,
  };
}
