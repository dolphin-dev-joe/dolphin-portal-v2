import { CustomFilter } from "@/components/table/types";
import { usePosServiceCategoryOptions } from "@/hooks/pos/usePosServiceCategoryOptions";
import { IPosService } from "./interfaces";

/**
 * Filter kategori untuk tabel Layanan POS — analog dengan parfum.
 * Opsi diambil dari lookup kategori layanan; `"all"` = tanpa filter,
 * field `"categoryId"` cocok dengan filter di API.
 */
export function usePosServiceFilters(): CustomFilter<IPosService>[] {
  const { options } = usePosServiceCategoryOptions();

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
