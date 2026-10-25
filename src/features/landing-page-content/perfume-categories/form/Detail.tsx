import { NumberInput } from "@components/inputs/NumberInput";
import SwitchInput from "@components/inputs/SwitchInput";
import { TextInput } from "@components/inputs/TextInput";
import { useNextSortOrder } from "@/hooks/useNextSortOrder";
import { useFormContext } from "react-hook-form";
import { usePathname } from "@hooks/usePathname";
import React, { useEffect } from "react";

export default function PerfumeCategoryForm() {
  const pathname = usePathname();
  const isCreate = pathname.includes("/create");
  const nextSortOrder = useNextSortOrder("perfume-categories/next-sort-order");
  const { setValue } = useFormContext();

  useEffect(() => {
    if (isCreate && nextSortOrder !== null) {
      setValue("sortOrder", nextSortOrder);
    }
  }, [isCreate, nextSortOrder, setValue]);

  return (
    <>
      {/* Name (Indonesian) */}
      <TextInput
        fieldName="name"
        fieldLabel="Name (Indonesian)"
        placeholder="Enter category name in Indonesian"
        isRequired
      />

      {/* Name (English) */}
      <TextInput
        fieldName="nameEn"
        fieldLabel="Name (English)"
        placeholder="Enter category name in English"
      />

      {/* Sort Order */}
      <NumberInput fieldName="sortOrder" fieldLabel="Sort Order" />

      {/* Active Status */}
      <SwitchInput
        fieldName="isActive"
        fieldLabel="Active Status"
        description="Enable or disable this category"
      />
    </>
  );
}
