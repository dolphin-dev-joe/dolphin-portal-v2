import { CustomFilter } from "@components/table/types";
import { usePricingCategoryOptions } from "@features/global/lookup/usePricingCategoryOptions";
import { IPricing } from "./interfaces";

/**
 * Filter kategori untuk tabel Pricing Items (landing page).
 * Opsi diambil dari lookup kategori pricing; `"all"` = tanpa filter,
 * field `"categoryId"` cocok dengan filter di API.
 */
export function usePricingFilters(): CustomFilter<IPricing>[] {
  const { options } = usePricingCategoryOptions();

  return [
    {
      key: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      type: "single",
      options: [
        { label: "All Categories", value: "all" },
        ...options.map((o) => ({
          label: String(o.label ?? ""),
          value: String(o.value),
        })),
      ],
    },
  ];
}
