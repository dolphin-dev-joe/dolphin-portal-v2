import { NumberInput } from "@components/inputs/NumberInput";
import { SelectInput } from "@components/inputs/SelectInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextAreaInput } from "@components/inputs/TextareaInput";
import { TextInput } from "@components/inputs/TextInput";
import { usePosServiceCategoryOptions } from "@/hooks/pos/usePosServiceCategoryOptions";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

const UNIT_OPTIONS = [
  { id: "kg", label: "kg" },
  { id: "pcs", label: "pcs" },
];

export default function PosServiceForm() {
  const { options: categoryOptions } = usePosServiceCategoryOptions();

  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("pos/services/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      <SelectInput
        fieldName="categoryId"
        fieldLabel="Kategori Layanan"
        options={categoryOptions}
        isRequired
      />
      <TextInput
        fieldName="name"
        fieldLabel="Nama Layanan"
        placeholder="Masukkan nama layanan"
        isRequired
      />
      <NumberInput
        fieldName="price"
        fieldLabel="Harga (Rp)"
        isRequired
      />
      <SelectInput
        fieldName="unit"
        fieldLabel="Satuan"
        options={UNIT_OPTIONS}
        isRequired
      />
      <TextInput
        fieldName="duration"
        fieldLabel="Durasi (tampilan)"
        placeholder="Contoh: 2 Hari"
      />
      <NumberInput
        fieldName="durationHours"
        fieldLabel="Durasi (jam)"
        placeholder="24"
      />
      <TextAreaInput
        fieldName="notes"
        fieldLabel="Catatan"
        placeholder="Catatan tambahan (opsional)"
      />
      <NumberInput fieldName="sortOrder" fieldLabel="Urutan" />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Status Aktif"
        description="Aktifkan atau nonaktifkan layanan ini"
      />
    </>
  );
}
