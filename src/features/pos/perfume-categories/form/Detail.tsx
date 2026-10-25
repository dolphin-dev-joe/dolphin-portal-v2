import { NumberInput } from "@components/inputs/NumberInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import { usePosPerfumeCategoryNextSortOrder } from "@/hooks/pos/usePosPerfumeCategoryNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

export default function PosPerfumeCategoryForm() {
  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = usePosPerfumeCategoryNextSortOrder();
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      <TextInput
        fieldName="name"
        fieldLabel="Nama Kategori"
        placeholder="Masukkan nama kategori parfum"
        isRequired
      />
      <NumberInput fieldName="sortOrder" fieldLabel="Urutan" />
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Status Aktif"
        description="Aktifkan atau nonaktifkan kategori ini"
      />
    </>
  );
}
