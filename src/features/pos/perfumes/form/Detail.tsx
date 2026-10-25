import { NumberInput } from "@components/inputs/NumberInput";
import { SelectInput } from "@components/inputs/SelectInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import { usePosPerfumeCategoryOptions } from "@/hooks/pos/usePosPerfumeCategoryOptions";
import { usePosPerfumeNextSortOrder } from "@/hooks/pos/usePosPerfumeNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

export default function PosPerfumeForm() {
  const { options: categoryOptions } =
    usePosPerfumeCategoryOptions();

  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = usePosPerfumeNextSortOrder();
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
        fieldLabel="Kategori Parfum"
        options={categoryOptions}
        placeholder="Pilih kategori"
      />
      <TextInput
        fieldName="name"
        fieldLabel="Nama Parfum"
        placeholder="Masukkan nama parfum (contoh: Downy)"
        isRequired
      />
      <NumberInput fieldName="sortOrder" fieldLabel="Urutan" />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Status Aktif"
        description="Aktifkan atau nonaktifkan parfum ini"
      />
    </>
  );
}
