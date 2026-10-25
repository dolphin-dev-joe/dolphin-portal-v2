import { useList } from "@refinedev/core";
import { useMemo } from "react";

interface CategoryOption {
  id: string;
  label: string;
}

export function usePosPerfumeCategoryOptions() {
  const {
    result,
    query: { isLoading },
  } = useList<{ id: string; name: string }>({
    resource: "pos-perfume-categories",
    pagination: { currentPage: 1, pageSize: 100 },
  });

  const options = useMemo<CategoryOption[]>(
    () =>
      (result?.data ?? []).map((cat) => ({
        id: String(cat.id),
        label: cat.name,
      })),
    [result?.data],
  );

  return { options, isLoading };
}
