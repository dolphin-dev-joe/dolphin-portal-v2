import { CustomFilter } from "@/components/table/types";
import { usePerfumeCategoryOptions } from "@features/global/lookup/usePerfumeCategoryOptions";
import { IPerfume } from "./interfaces";

/**
 * Filter konfigurasi untuk tabel perfumes landing page.
 * Opsi kategori diambil dari lookup API (cached, jadi tidak fetch berkali-kali).
 * Value `"all"` = tanpa filter; field `"categoryId"` cocok dengan filter API.
 */
export function usePerfumeFilters(): CustomFilter<IPerfume>[] {
  const { options: categoryOptions } = usePerfumeCategoryOptions();

  return [
    {
      key: "categoryId",
      label: "Kategori",
      placeholder: "Pilih Kategori",
      type: "single",
      options: [
        { label: "Semua Kategori", value: "all" },
        ...categoryOptions.map((opt) => ({
          label: String(opt.label ?? opt.value),
          value: opt.value,
        })),
      ],
    },
  ];
}
