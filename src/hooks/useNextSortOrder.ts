import { useCustom } from "@refinedev/core";

/**
 * Mengambil sortOrder berikutnya (gap-filling) dari endpoint `next-sort-order`.
 * Dipakai untuk autofill field "Urutan" saat membuat data baru.
 * `endpoint` relatif terhadap base URL API.
 *
 * @example
 * const next = useNextSortOrder("faqs/next-sort-order");
 */
export function useNextSortOrder(endpoint: string) {
  const { result } = useCustom<{ sortOrder?: number | null }>({
    url: endpoint,
    method: "get",
    queryOptions: {
      // Always fetch fresh — another admin may have added a row meanwhile.
      staleTime: 0,
      gcTime: 0,
    },
    errorNotification: false,
  });

  return result?.data?.sortOrder ?? null;
}
