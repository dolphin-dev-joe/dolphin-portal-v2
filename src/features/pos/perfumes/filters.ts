import { CustomFilter } from "@/components/table/types";
import { usePosPerfumeCategoryOptions } from "@/hooks/pos/usePosPerfumeCategoryOptions";
import { IPosPerfume } from "./interfaces";

/**
 * Filter kategori untuk tabel Parfum POS.
 * Opsi diambil dari lookup kategori parfum; `"all"` = tanpa filter,
 * field `"categoryId"` cocok dengan filter di API.
 */
export function usePosPerfumeFilters(): CustomFilter<IPosPerfume>[] {
  const { options } = usePosPerfumeCategoryOptions();

  return [
    {
      key: "categoryId",
      label: "Kategori",
      placeholder: "Pilih Kategori",
      type: "single",
      options: [
        { label: "Semua Kategori", value: "all" },
        ...options.map((o) => ({ label: o.label, value: o.id })),
      ],
    },
  ];
}
